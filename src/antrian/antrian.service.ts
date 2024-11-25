import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { CreateAntrianAdmisiDto } from './dto/create-admisi.dto';

@Injectable()
export class AntrianService {
  constructor(private prisma: PrismaService) {}

  async panggilAntrianAdmisi(id: number, idFasyankes: string) {
    try {
      const antrian = await this.prisma.antrianAdmisi.findUnique({
        where: { id,
          idFasyankes
         },
        
      });
  
      if (antrian) {
        return {
          status: 'success',
          message: 'Antrian ditemukan',
          data: antrian,
        };
      } else {
        return {
          status: 'failed',
          message: 'Antrian tidak ditemukan',
        };
      }
    } catch (error) {
      return {
        status: 'failed',
        message: 'Terjadi kesalahan, silakan coba lagi.',
        error: error.message,
      };
    }
  }
  

  async storeAntrianAdmisi(dto: CreateAntrianAdmisiDto) {
    const { jumlahPanggil, idFasyankes } = dto;

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

      const updatedJumlahPanggil = jumlahPanggil + countToday;

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

      return {
        status: 'success',
        message: 'Antrian berhasil disimpan',
        data: antrian,
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Terjadi kesalahan saat menyimpan antrian',
        error: error.message,
      };
    }
  }


  async panggilAntrianPasien(id: number, idFasyankes: string) {
    const pasien = await this.prisma.antrianPasien.findFirst({
      where: {
        id,
        idFasyankes,
      },
      include: {
        pendaftaran: true,
      },
    });

    if (!pasien) {
      return {
        success: false,
        message: 'Pasien tidak ditemukan.',
      };
    }

    await this.prisma.antrianPasien.update({
      where: {
        id: id,
      },
      data: {
        status: 'Sudah Dipanggil',
        jumlahPanggil: pasien.jumlahPanggil + 1,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: 'Memanggil Nomor : ' + pasien.nomor,
    };
  }
}
