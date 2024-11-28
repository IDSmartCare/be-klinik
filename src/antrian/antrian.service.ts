import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { CreateAntrianAdmisiDto } from './dto/create-admisi.dto';
import { QueueGateway } from 'src/queue/queue.gateway';

@Injectable()
export class AntrianService {
  constructor(
    private prisma: PrismaService,
    private queueGateway: QueueGateway,
  ) {}

  // Di tampilan admin yang Pendaftaran/Antrian Admisi
  async getAllAntrianAdmisiToday(idFasyankes: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const antrianToday = await this.prisma.antrianAdmisi.findMany({
      where: {
        idFasyankes: idFasyankes,
        tanggal: {
          gte: today,
          lt: tomorrow,
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    this.queueGateway.emitDataAntrianAdmisi(antrianToday);

    return { antrianToday };
  }

  async panggilAntrianAdmisi(id: number) {
    try {
      const antrian = await this.prisma.antrianAdmisi.findUnique({
        where: { id },
      });

      if (antrian) {
        const newNomor = antrian.nomor.replace(/-0*/g, '');
        const message = newNomor;
        await this.queueGateway.emitPanggilAntrianAdmisi(
          antrian.nomor,
          message,
        );

        return {
          success: true,
          message: 'Antrian ditemukan',
          data: antrian,
        };
      } else {
        return {
          success: false,
          message: 'Antrian tidak ditemukan',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Terjadi kesalahan, silakan coba lagi.',
        error: error.message,
      };
    }
  }
  async panggilAntrianPasien(id: number) {
    try {
      const antrian = await this.prisma.antrianPasien.findUnique({
        where: { id },
        include: {
          doctor: {
            select: {
              unit: true,
            },
          },
        },
      });

      if (antrian) {
        const newNomor = antrian.nomor.replace(/-0*/g, '');
        const message = newNomor;
        await this.queueGateway.emitPanggilAntrianPasien(
          antrian.nomor,
          message,
          antrian.doctor.unit.replace(/\s+/g, '').toLowerCase(),
        );

        return {
          success: true,
          message: 'Antrian ditemukan',
          data: antrian,
        };
      } else {
        return {
          success: false,
          message: 'Antrian tidak ditemukan',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Terjadi kesalahan, silakan coba lagi.',
        error: error.message,
      };
    }
  }

  async storeAntrianAdmisi(dto: CreateAntrianAdmisiDto) {
    const { idFasyankes } = dto;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const countToday = await this.prisma.antrianAdmisi.count({
        where: {
          tanggal: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      const updatedJumlahPanggil = countToday + 1;

      const lastAntrian = await this.prisma.antrianAdmisi.findFirst({
        orderBy: {
          nomor: 'desc',
        },
        where: {
          tanggal: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      let nomorBaru = 'A-0001';
      if (lastAntrian) {
        const lastNomor = lastAntrian.nomor;
        const lastNumber = parseInt(lastNomor.split('-')[1]);
        const newNumber = lastNumber + 1;
        nomorBaru = `A-${newNumber.toString().padStart(4, '0')}`;
      }

      const newAntrian = {
        nomor: nomorBaru,
        tanggal: new Date(),
        status: 'Belum Dipanggil',
        jumlahPanggil: updatedJumlahPanggil,
        idFasyankes,
      };

      const antrian = await this.prisma.antrianAdmisi.create({
        data: newAntrian,
      });

      await this.getAllAntrianAdmisiToday(idFasyankes);

      return {
        success: true,
        message: 'Antrian berhasil disimpan',
        data: antrian,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Terjadi kesalahan saat menyimpan antrian',
        error: error.message,
      };
    }
  }
}
