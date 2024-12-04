/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class MasterTarifService {
  constructor(private prisma: PrismaService) {}

  async getTarif(idFasyankes: string) {
    try {
      const tarif = await this.prisma.masterTarif.findMany({
        where: { idFasyankes },
      });

      if (tarif.length === 0) {
        throw new NotFoundException(
          `Tarif untuk Fasyankes ID ${idFasyankes} tidak ada`,
        );
      }

      return tarif;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createTarif(data: {
    idFasyankes: string;
    namaTarif: string;
    kategoriTarif: string;
    hargaTarif?: string;
    penjamin?: string;
    isAktif?: boolean;
    doctorId?: number;
  }) {
    try {
      // Jika ada doctorId dan hargaTarif, cek apakah tarif dokter sudah ada
      if (data.doctorId && data.hargaTarif) {
        const existingDoctorCost = await this.prisma.doctorCosts.findFirst({
          where: {
            doctorId: data.doctorId,
          },
        });
  
        if (existingDoctorCost) {
          throw new BadRequestException('Tarif untuk dokter ini sudah terdaftar.');
        }
      }
  
      // Lanjutkan proses create masterTarif
      const newTarif = await this.prisma.masterTarif.create({
        data,
      });
  
      // Jika ada doctorId dan hargaTarif, buat tarif dokter baru
      if (data.doctorId && data.hargaTarif) {
        await this.prisma.doctorCosts.create({
          data: {
            doctorId: data.doctorId,
            baseFee: data.hargaTarif,
          },
        });
      }
  
      return newTarif;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(
        error.message || 'Gagal membuat tarif. Silakan coba lagi.'
      );
    }
  }
  

  async findOne(id: number) {
    try {
      const masterTarif = await this.prisma.masterTarif.findUnique({
        where: { id },
      });

      if (!masterTarif) {
        return {
          success: false,
          message: `Tarif dengan id ${id} tidak ditemukan`,
          data: null,
        };
      }

      return {
        success: true,
        message: 'Data berhasil ditemukan',
        data: masterTarif,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Terjadi kesalahan saat mengambil data',
        error: error.message,
      };
    }
  }

  async updateTarif(data: {
    id: number;
    namaTarif?: string;
    kategoriTarif?: string;
    hargaTarif?: string;
    doctorId?: number;
  }) {
    try {
      // Update master tarif
      const updateTarif = await this.prisma.masterTarif.update({
        where: { id: data.id },
        data: {
          namaTarif: data.namaTarif,
          kategoriTarif: data.kategoriTarif,
          hargaTarif: data.hargaTarif,
          doctorId: data.doctorId,
        },
      });

      if (data.doctorId) {
        const dataCost = await this.prisma.doctorCosts.findFirst({
          where: { doctorId: data.doctorId },
        });

        if (!dataCost) {
          throw new NotFoundException(
            `Doctor costs not found for doctorId: ${data.doctorId}`,
          );
        }

        await this.prisma.doctorCosts.update({
          where: { id: dataCost.id },
          data: {
            baseFee: data.hargaTarif,
          },
        });
      }
      console.log(data.doctorId);

      return updateTarif;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(
        `Failed to update Tarif. Error: ${error.message}`,
      );
    }
  }
}
