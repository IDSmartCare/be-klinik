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
      const cost = await this.prisma.doctorCosts.create({
        data: {
          doctorId: data.doctorId,
          baseFee: data.hargaTarif,
        },
      });
      return newTarif;
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Failed to create Tarif');
    }
  }
}
