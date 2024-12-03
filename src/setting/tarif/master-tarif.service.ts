/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
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
      const newTarif = await this.prisma.masterTarif.create({
        data,
      });
      if (data.doctorId) {
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
      throw new NotFoundException('Failed to create Tarif');
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
