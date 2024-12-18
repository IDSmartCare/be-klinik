import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJadwalDokterDto } from './dto/create-jadwal-dokter.dto';
import { PrismaService } from 'src/service/prisma.service';
import { UpdateJadwalDokterDto } from './dto/update-jadwal-dokter.dto';
import { Doctors } from '@prisma/client';

@Injectable()
export class JadwalDokterService {
  constructor(private prisma: PrismaService) {}
  async listSchedule(idFasyankes: string): Promise<any> {
    const doctorSchedules = await this.prisma.doctors.findMany({
      where: {
        idFasyankes,
      },
      select: {
        id: true,
        name: true,
        avatar: true,
        unit: true,
        availableDays: {
          select: {
            id: true,
            day: true,
            slot: true,
            availableTimes: {
              select: {
                id: true,
                from: true,
                to: true,
              },
            },
          },
        },
      },
    });

    const formattedSchedules = doctorSchedules.map((doctor) => {
      return {
        id: doctor.id,
        name: doctor.name,
        unit: doctor.unit,
        avatar: doctor.avatar ?? process.env.AVATAR_DUMMY,
        schedule: doctor.availableDays.map((day) => ({
          id: day.id,
          day: day.day,
          slot: day.slot,
        })),
      };
    });

    return formattedSchedules;
  }

  async findJadwalDokterToday(
    idFasyankes: string,
    dayNumber: string,
  ): Promise<any> {
    try {
      const dayMap = {
        '0': 'Minggu',
        '1': 'Senin',
        '2': 'Selasa',
        '3': 'Rabu',
        '4': 'Kamis',
        '5': 'Jumat',
        '6': 'Sabtu',
      };

      const day = dayMap[dayNumber];
      console.log(day);

      if (!day) {
        throw new Error('Invalid day number');
      }

      const doctors = await this.prisma.doctors.findMany({
        where: {
          idFasyankes,
          isAktif: true,
          status: 'active',
          availableDays: {
            some: {
              day,
            },
          },
        },
        select: {
          id: true,
          name: true,
          unit: true,
          availableDays: {
            where: {
              day,
            },
            select: {
              id: true,
              day: true,
              slot: true,
              availableTimes: {
                select: {
                  id: true,
                  from: true,
                  to: true,
                  availableSlots: {
                    where: {
                      is_booked: false,
                    },
                    select: {
                      id: true,
                      from: true,
                      to: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      const formattedResponse = doctors.map((doctor) => ({
        id: doctor.id,
        name: doctor.name,
        unit: doctor.unit,
        days: doctor.availableDays.map((days) => ({
          id: days.id,
          day: days.day,
          slot: days.slot,
          times: days.availableTimes.map((time) => ({
            id: time.id,
            from: time.from,
            to: time.to,
          })),
        })),
      }));

      return {
        success: true,
        data: formattedResponse,
      };
    } catch (error) {
      console.error('Error in findJadwalDokterToday:', error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        data: null,
      };
    }
  }

  async createSchedule(createJadwalDokterDto: CreateJadwalDokterDto) {
    const { dokter_id, slot, days, times } = createJadwalDokterDto;
    return this.prisma.$transaction(async (prisma) => {
      const checkDoctor = await prisma.doctors.findFirst({
        where: {
          id: dokter_id,
        },
      });
      if (!checkDoctor) {
        throw new NotFoundException('Dokter not found');
      }

      // Check for existing days
      const existingDays = await prisma.doctorAvailableDays.findMany({
        where: {
          doctorId: dokter_id,
        },
        select: { day: true },
      });
      const existingDayNames = existingDays.map((day) => day.day);
      const duplicateDays = days.filter((day) =>
        existingDayNames.includes(day),
      );

      if (duplicateDays.length > 0) {
        throw new BadRequestException(
          `Hari ${duplicateDays.join(', ')} sudah ada dalam jadwal dokter`,
        );
      }

      const availableDays = await Promise.all(
        days.map((day) =>
          prisma.doctorAvailableDays.create({
            data: {
              doctorId: dokter_id,
              day,
              slot,
            },
          }),
        ),
      );

      const allSlots = [];
      for (const time of times) {
        const { from, to } = time;
        const newFrom = new Date(`1970-01-01T${from}:00`);
        const newTo = new Date(`1970-01-01T${to}:00`);

        if (newTo <= newFrom) {
          throw new BadRequestException(
            `Jadwal waktu ${from} - ${to} tidak valid.`,
          );
        }

        for (const day of days) {
          const existingTimesForDay =
            await prisma.doctorAvailableTimes.findMany({
              where: {
                doctorId: dokter_id,
                availableDay: {
                  day,
                },
              },
            });

          existingTimesForDay.forEach((existingTime) => {
            const existingFrom = new Date(`1970-01-01T${existingTime.from}:00`);
            const existingTo = new Date(`1970-01-01T${existingTime.to}:00`);

            if (
              (newFrom >= existingFrom && newFrom < existingTo) ||
              (newTo > existingFrom && newTo <= existingTo) ||
              (newFrom <= existingFrom && newTo >= existingTo)
            ) {
              throw new BadRequestException(
                `Jadwal waktu ${from} - ${to} tidak boleh diantara jadwal ${existingTime.from} - ${existingTime.to}.`,
              );
            }
          });
        }

        const availableTimeSlots = await Promise.all(
          availableDays.map((availableDay) =>
            prisma.doctorAvailableTimes.create({
              data: {
                doctorId: dokter_id,
                available_day_id: availableDay.id,
                from,
                to,
              },
            }),
          ),
        );

        for (const availableTimeSlot of availableTimeSlots) {
          let current = new Date(`1970-01-01T${from}:00`);
          const end = new Date(`1970-01-01T${to}:00`);

          while (current < end) {
            const slotFrom = current.toTimeString().slice(0, 5);
            current.setMinutes(current.getMinutes() + slot);
            const slotTo = current.toTimeString().slice(0, 5);

            if (current <= end) {
              const savedSlot = await prisma.doctorAvailableSlots.create({
                data: {
                  doctorId: dokter_id,
                  doctor_available_times_id: availableTimeSlot.id,
                  from: slotFrom,
                  to: slotTo,
                  is_booked: false,
                },
              });
              allSlots.push(savedSlot);
            }
          }
        }
      }

      return {
        success: true,
        message: 'Berhasil membuat Jadwal Dokter',
      };
    });
  }

  async getDetailSchedule(idFasyankes: string, idDokter: number) {
    const doctor = await this.prisma.doctors.findFirst({
      where: { id: idDokter, idFasyankes },
      include: {
        availableDays: {
          select: {
            id: true,
            day: true,
            slot: true,
            availableTimes: {
              select: {
                id: true,
                from: true,
                to: true,
              },
            },
          },
        },
      },
    });

    if (!doctor) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Data dokter tidak ditemukan',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      doctor: {
        id: doctor.id,
        name: doctor.name,
        unit: doctor.unit,
        schedule: doctor.availableDays.map((days) => ({
          id: days.id,
          day: days.day,
          slot: days.slot,
          times: days.availableTimes.map((times) => ({
            id: times.id,
            from: times.from,
            to: times.to,
          })),
        })),
      },
    };
  }

  async updateSchedule(
    updateJadwalDokterDto: UpdateJadwalDokterDto,
    availableDayId: number,
  ) {
    const { dokter_id, slot, times } = updateJadwalDokterDto;
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const existingDay = await prisma.doctorAvailableDays.findFirst({
          where: {
            id: Number(availableDayId),
            doctorId: dokter_id,
            deletedAt: null,
          },
        });

        console.log(existingDay);
        if (!existingDay) {
          throw new HttpException(
            {
              statusCode: HttpStatus.NOT_FOUND,
              success: false,
              message: 'Data jadwal tidak ditemukan',
            },
            HttpStatus.NOT_FOUND,
          );
        }

        const updatedDays = await prisma.doctorAvailableDays.update({
          where: { id: existingDay.id },
          data: {
            slot,
          },
        });

        await prisma.doctorAvailableTimes.updateMany({
          where: {
            available_day_id: existingDay.id,
            doctorId: dokter_id,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        });

        await prisma.doctorAvailableSlots.updateMany({
          where: {
            doctorId: dokter_id,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
          },
        });

        for (const time of times) {
          const { from, to } = time;
          const newFrom = new Date(`1970-01-01T${from}:00`);
          const newTo = new Date(`1970-01-01T${to}:00`);

          if (newTo <= newFrom) {
            throw new BadRequestException(
              `Jadwal waktu ${from} - ${to} tidak valid.`,
            );
          }

          const existingTimesForDay =
            await prisma.doctorAvailableTimes.findMany({
              where: {
                available_day_id: existingDay.id,
                doctorId: dokter_id,
                deletedAt: null,
              },
            });

          existingTimesForDay.forEach((existingTime) => {
            const existingFrom = new Date(`1970-01-01T${existingTime.from}:00`);
            const existingTo = new Date(`1970-01-01T${existingTime.to}:00`);

            if (
              (newFrom >= existingFrom && newFrom < existingTo) ||
              (newTo > existingFrom && newTo <= existingTo) ||
              (newFrom <= existingFrom && newTo >= existingTo)
            ) {
              throw new BadRequestException(
                `Jadwal waktu ${from} - ${to} bentrok dengan jadwal existing: ${existingTime.from} - ${existingTime.to}`,
              );
            }
          });

          const availableTime = await prisma.doctorAvailableTimes.create({
            data: {
              doctorId: dokter_id,
              available_day_id: existingDay.id,
              from,
              to,
            },
          });

          let current = new Date(`1970-01-01T${from}:00`);
          const end = new Date(`1970-01-01T${to}:00`);

          while (current < end) {
            const slotFrom = current.toTimeString().slice(0, 5);
            current.setMinutes(current.getMinutes() + slot);
            const slotTo = current.toTimeString().slice(0, 5);

            if (current <= end) {
              await prisma.doctorAvailableSlots.create({
                data: {
                  doctorId: dokter_id,
                  from: slotFrom,
                  to: slotTo,
                  doctor_available_times_id: availableTime.id,
                  is_booked: false,
                },
              });
            }
          }
        }

        return {
          statusCode: HttpStatus.OK,
          success: true,
          message: 'Berhasil memperbarui jadwal dokter',
          data: updatedDays,
        };
      });
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          success: false,
          message: 'Gagal memperbarui jadwal dokter',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findAllDoctorsWithoutAvailability(
    idFasyankes: string,
  ): Promise<{ success: boolean; data?: Doctors[]; message: string }> {
    try {
      const data = await this.prisma.doctors.findMany({
        where: {
          idFasyankes,
          isAktif: true,
          status: 'active',
          availableDays: {
            none: {},
          },
        },
      });

      if (data.length === 0) {
        return {
          success: false,
          message: 'Tidak ada dokter tanpa jadwal tersedia untuk Fasyankes ini',
          data: [],
        };
      }

      return {
        success: true,
        message: `Berhasil menemukan ${data.length} dokter tanpa jadwal`,
        data,
      };
    } catch (error) {
      console.log('Error in findAllDoctorsWithoutAvailability:', error);

      throw new HttpException(
        error.message || 'Terjadi kesalahan saat mengambil data dokter',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
