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
            sun: true,
            mon: true,
            tue: true,
            wed: true,
            thu: true,
            fri: true,
            sat: true,
            slot: true,
          },
        },
        availableTimes: {
          select: {
            from: true,
            to: true,
          },
        },
      },
    });

    const dayNamesInIndonesian = {
      sun: 'Minggu',
      mon: 'Senin',
      tue: 'Selasa',
      wed: 'Rabu',
      thu: 'Kamis',
      fri: 'Jumat',
      sat: 'Sabtu',
    };

    const formattedSchedules = doctorSchedules.map((doctor) => {
      const days = [];
      let slot = null;

      if (doctor.availableDays && doctor.availableDays.length > 0) {
        slot = doctor.availableDays[0].slot;

        for (const [day, indoDayName] of Object.entries(dayNamesInIndonesian)) {
          if (doctor.availableDays[0][day] === '1') {
            days.push(indoDayName);
          }
        }
      }

      return {
        id: doctor.id,
        name: doctor.name,
        unit: doctor.unit,
        slot: slot,
        avatar: doctor.avatar ?? process.env.AVATAR_DUMMY,
        days: days,
        times: doctor.availableTimes.map((time) => ({
          from: time.from,
          to: time.to,
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
        '0': { column: 'sun', indo: 'Minggu' },
        '1': { column: 'mon', indo: 'Senin' },
        '2': { column: 'tue', indo: 'Selasa' },
        '3': { column: 'wed', indo: 'Rabu' },
        '4': { column: 'thu', indo: 'Kamis' },
        '5': { column: 'fri', indo: 'Jumat' },
        '6': { column: 'sat', indo: 'Sabtu' },
      };

      if (!dayMap[dayNumber]) {
        throw new BadRequestException(
          'Invalid day number. Please use 0-6 (0 = Sunday, 6 = Saturday)',
        );
      }

      const { column: dayColumn, indo: hariIndonesia } = dayMap[dayNumber];

      const doctors = await this.prisma.doctors.findMany({
        where: {
          idFasyankes: idFasyankes,
          isAktif: true,
          status: 'active',
          availableDays: {
            some: {
              [dayColumn]: '1',
            },
          },
        },
        select: {
          id: true,
          name: true,
          unit: true,
          availableDays: {
            select: {
              id: true,
              [dayColumn]: true,
            },
          },
          availableTimes: {
            select: {
              id: true,
              from: true,
              to: true,
            },
          },
        },
      });

      const formattedResponse = doctors.map((doctor) => {
        const availableDay = doctor.availableDays.find(
          (day) => day[dayColumn] === '1',
        );
        return {
          id: doctor.id,
          name: doctor.name,
          unit: doctor.unit,
          hari: {
            id: availableDay?.id || null,
            name: availableDay ? hariIndonesia : null,
          },
          jam_praktek: doctor.availableTimes.map((time) => ({
            id: time.id,
            from: time.from,
            to: time.to,
          })),
        };
      });

      return {
        success: true,
        data: formattedResponse,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'An error occurred',
        data: null,
      };
    }
  }

  async createSchedule(createJadwalDokterDto: CreateJadwalDokterDto) {
    const { dokter_id, slot, days, times } = createJadwalDokterDto;
    return this.prisma.$transaction(async (prisma) => {
      const existingSchedule = await prisma.doctorAvailableDays.findFirst({
        where: { doctorId: dokter_id },
        include: { doctor: true },
      });
      if (existingSchedule) {
        throw new BadRequestException(
          `Jadwal ${existingSchedule.doctor.name} sudah ada`,
        );
      }

      const availableDays = await prisma.doctorAvailableDays.create({
        data: {
          doctorId: dokter_id,
          sun: days.includes('sun') ? '1' : '0',
          mon: days.includes('mon') ? '1' : '0',
          tue: days.includes('tue') ? '1' : '0',
          wed: days.includes('wed') ? '1' : '0',
          thu: days.includes('thu') ? '1' : '0',
          fri: days.includes('fri') ? '1' : '0',
          sat: days.includes('sat') ? '1' : '0',
          slot,
        },
      });

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

        const existingSlots = await prisma.doctorAvailableTimes.findMany({
          where: {
            doctorId: dokter_id,
          },
        });

        for (const slot of existingSlots) {
          const existingFrom = new Date(`1970-01-01T${slot.from}:00`);
          const existingTo = new Date(`1970-01-01T${slot.to}:00`);

          if (
            (newFrom >= existingFrom && newFrom < existingTo) ||
            (newTo > existingFrom && newTo <= existingTo) ||
            (newFrom <= existingFrom && newTo >= existingTo)
          ) {
            throw new BadRequestException(
              `Jadwal waktu ${from} - ${to} tidak boleh diantara jadwal ${slot.from} - ${slot.to}.`,
            );
          }
        }

        const availableTime = await prisma.doctorAvailableTimes.create({
          data: {
            doctorId: dokter_id,
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
            const slotEntry = {
              doctorId: dokter_id,
              from: slotFrom,
              to: slotTo,
              doctor_available_times_id: availableTime.id,
              is_booked: false,
            };

            const savedSlot = await prisma.doctorAvailableSlots.create({
              data: slotEntry,
            });

            allSlots.push(savedSlot);
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
        availableDays: true,
        availableSlots: true,
        availableTimes: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const dayNames: Record<string, string> = {
      sun: 'Minggu',
      mon: 'Senin',
      tue: 'Selasa',
      wed: 'Rabu',
      thu: 'Kamis',
      fri: 'Jumat',
      sat: 'Sabtu',
    };

    const availableDays = Object.entries(dayNames)
      .filter(([key]) => doctor.availableDays[0][key] !== null)
      .map(([key, name]) => ({
        day: name,
      }));

    return {
      doctor: {
        id: doctor.id,
        name: doctor.name,
        phone: doctor.phone,
        unit: doctor.unit,
        str: doctor.str,
        sip: doctor.sip,
        isAktif: doctor.isAktif,
        status: doctor.status,
        avatar: doctor.avatar,
      },
      availableDays,
      availableSlots: doctor.availableSlots,
      availableTimes: doctor.availableTimes,
    };
  }

  async updateSchedule(updateJadwalDokterDto: UpdateJadwalDokterDto) {
    const { dokter_id, slot, days, times } = updateJadwalDokterDto;
    try {
      return await this.prisma.$transaction(async (prisma) => {
        const existingDay = await prisma.doctorAvailableDays.findFirst({
          where: { doctorId: dokter_id },
        });
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
            sun: days.includes('sun') ? '1' : '0',
            mon: days.includes('mon') ? '1' : '0',
            tue: days.includes('tue') ? '1' : '0',
            wed: days.includes('wed') ? '1' : '0',
            thu: days.includes('thu') ? '1' : '0',
            fri: days.includes('fri') ? '1' : '0',
            sat: days.includes('sat') ? '1' : '0',
            slot,
          },
        });
        await prisma.doctorAvailableTimes.updateMany({
          where: { doctorId: dokter_id },
          data: { deletedAt: new Date() },
        });
        await prisma.doctorAvailableSlots.updateMany({
          where: { doctorId: dokter_id },
          data: { deletedAt: new Date() },
        });
        for (const time of times) {
          const { from, to } = time;
          const availableTime = await prisma.doctorAvailableTimes.create({
            data: { doctorId: dokter_id, from, to },
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
          AND: [
            {
              availableDays: {
                none: {},
              },
            },
            {
              availableTimes: {
                none: {},
              },
            },
            {
              availableSlots: {
                none: {},
              },
            },
          ],
        },
        include: {
          availableDays: true,
          availableTimes: true,
          availableSlots: true,
        },
      });

      if (data.length === 0) {
        return {
          success: false,
          message: 'No doctors without availability found for this Fasyankes',
        };
      }

      return {
        success: true,
        message: 'Successfully fetched doctors without availability',
        data,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
