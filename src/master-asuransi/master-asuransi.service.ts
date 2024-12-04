import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { CreateMasterAsuransiDto } from './dto/create-master-asuransi.dto';
import { MasterAsuransi } from '@prisma/client';

@Injectable()
export class MasterAsuransiService {
  constructor(private readonly prisma: PrismaService) {}

  async listAsuransi(
    idFasyankes: string,
  ): Promise<{ success: boolean; data: MasterAsuransi[]; message: string }> {
    const data = await this.prisma.masterAsuransi.findMany({
      where: {
        idFasyankes: idFasyankes,
      },
    });

    if (!data || data.length === 0) {
      throw new NotFoundException({
        success: false,
        message: `No Master Asuransi found for this Fasyankes`,
      });
    }

    return {
      success: true,
      message: 'Success Get Master Asuransi',
      data: data,
    };
  }

  async create(createMasterAsuransiDto: CreateMasterAsuransiDto) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Ambil data terakhir berdasarkan kodeAsuransi
    const lastAsuransi = await this.prisma.masterAsuransi.findFirst({
      orderBy: {
        kodeAsuransi: 'desc',
      },
    });

    let increment = '0001';
    if (lastAsuransi) {
      // Ambil 4 digit terakhir dari kodeAsuransi sebelumnya dan tambahkan 1
      const lastIncrement = parseInt(lastAsuransi.kodeAsuransi.slice(-4));
      increment = (lastIncrement + 1).toString().padStart(4, '0');
    }

    const kodeAsuransi = `AS-${year}${month}${increment}`;

    const newAsuransi = await this.prisma.masterAsuransi.create({
      data: {
        ...createMasterAsuransiDto,
        kodeAsuransi: kodeAsuransi,
      },
    });

    return {
      success: true,
      data: [
        {
          id: newAsuransi.id,
          kodeAsuransi: newAsuransi.kodeAsuransi,
          namaAsuransi: newAsuransi.namaAsuransi,
          namaPic: newAsuransi.namaPic,
          alamat: newAsuransi.alamat,
          picEmail: newAsuransi.picEmail,
          picPhone: newAsuransi.picPhone,
          from: newAsuransi.from,
          to: newAsuransi.to,
          isAktif: newAsuransi.isAktif,
          idFasyankes: newAsuransi.idFasyankes,
        },
      ],
    };
  }

  async updateAsuransi(
    id: number,
    data: Partial<MasterAsuransi>,
  ): Promise<{ success: boolean; message: string; data?: MasterAsuransi }> {
    try {
      const masterAsuransi = await this.prisma.masterAsuransi.findUnique({
        where: { id: id },
      });

      if (!masterAsuransi) {
        return {
          success: false,
          message: `Data asuransi dengan ID ${id} tidak ditemukan.`,
        };
      }

      if (data.idFasyankes && data.idFasyankes !== masterAsuransi.idFasyankes) {
        return {
          success: false,
          message: `ID Fasyankes ${data.idFasyankes} tidak cocok dengan data asuransi.`,
        };
      }

      const updatedAsuransi = await this.prisma.masterAsuransi.update({
        where: { id: id },
        data: {
          namaPic: data.namaPic ?? masterAsuransi.namaPic,
          picEmail: data.picEmail ?? masterAsuransi.picEmail,
          picPhone: data.picPhone ?? masterAsuransi.picPhone,
          from: data.from ?? masterAsuransi.from,
          to: data.to ?? masterAsuransi.to,
        },
      });

      return {
        success: true,
        message: `Asuransi ${updatedAsuransi.namaAsuransi} berhasil diperbarui.`,
        data: updatedAsuransi,
      };
    } catch (error) {
      return {
        success: false,
        message: `Gagal memperbarui data asuransi: ${error.message}`,
      };
    }
  }

  async deleteAsuransi(
    id: string,
    idFasyankes: string,
  ): Promise<{ message: string; success: boolean }> {
    try {
      const masterAsuransi = await this.prisma.masterAsuransi.findFirst({
        where: { id: Number(id), idFasyankes: idFasyankes },
      });

      if (!masterAsuransi) {
        throw new HttpException(
          `Data asuransi dengan ID ${id} dan ID Fasyankes ${idFasyankes} tidak ditemukan.`,
          HttpStatus.NOT_FOUND,
        );
      }

      const deleteAsuransi = await this.prisma.masterAsuransi.delete({
        where: { id: Number(id) },
      });

      return {
        message: `Asuransi ${deleteAsuransi.namaAsuransi} berhasil dihapus.`,
        success: true,
      };
    } catch (error) {
      return {
        message: `Gagal menghapus data asuransi: ${error.message}`,
        success: false,
      };
    }
  }

  async findByIdWithResponse(id: number, idFasyankes: string) {
    try {
      const result = await this.prisma.masterAsuransi.findUnique({
        where: {
          id: Number(id),
          idFasyankes: idFasyankes,
        },
      });

      if (!result) {
        throw new NotFoundException({
          success: false,
          message: `Data dengan id ${id} dan idFasyankes ${idFasyankes} tidak ditemukan.`,
        });
      }

      return {
        success: true,
        message: 'Data berhasil ditemukan.',
        data: result,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching data:', error);
      throw new Error('Terjadi kesalahan pada server.');
    }
  }
}
