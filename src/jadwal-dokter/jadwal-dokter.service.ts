import { Injectable } from '@nestjs/common';
import { CreateJadwalDokterDto } from './dto/create-jadwal-dokter.dto';
import { PrismaService } from 'src/service/prisma.service';

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
        days: days,
        times: doctor.availableTimes.map((time) => ({
          from: time.from,
          to: time.to,
        })),
      };
    });

    return formattedSchedules;
  }

  async createSchedule(createJadwalDokterDto: CreateJadwalDokterDto) {
    const { dokter_id, slot, days, times } = createJadwalDokterDto;

    return this.prisma.$transaction(async (prisma) => {
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

        const existingSlots = await prisma.doctorAvailableTimes.findMany({
          where: {
            doctorId: dokter_id,
          },
        });

        for (const slot of existingSlots) {
          const existingFrom = new Date(`1970-01-01T${slot.from}:00`);
          const existingTo = new Date(`1970-01-01T${slot.to}:00`);

          if (newFrom < existingTo && newTo > existingFrom) {
            throw new Error(
              `Jadwal waktu ${from} - ${to} tumpang tindih dengan jadwal lainnya.`,
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
}