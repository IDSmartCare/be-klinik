import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { CreateMasterAsuransiDto } from './dto/create-master-asuransi.dto';
import { MasterAsuransi, Prisma } from '@prisma/client';

@Injectable()
export class MasterAsuransiService {
  constructor(private readonly prisma: PrismaService) {}

 async listAsuransi(): Promise<MasterAsuransi[]> {
   return this.prisma.masterAsuransi.findMany();
 }



 async create(createMasterAsuransiDto: CreateMasterAsuransiDto) {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');

  // Hitung jumlah data untuk membuat increment ID
  const count = await this.prisma.masterAsuransi.count();
  const increment = (count + 1).toString().padStart(4, '0');

  // Buat kodeAsuransi
  const kodeAsuransi = `AS-${year}${month}${increment}`;

  // Tambahkan data baru ke database
  const newAsuransi = await this.prisma.masterAsuransi.create({
    data: {
      ...createMasterAsuransiDto,
      kodeAsuransi: kodeAsuransi,
    },
  });

  // Format respons sesuai permintaan
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
        tarif: newAsuransi.tarif,
        idFasyankes: newAsuransi.idFasyankes,
      },
    ],
  };
}


async updateAsuransi(
  id: number,
  data: Partial<MasterAsuransi>,
): Promise<{ success: boolean; message: string; data: MasterAsuransi }> {
  try {
    // Periksa apakah ID asuransi ada
    const masterAsuransi = await this.prisma.masterAsuransi.findUnique({
      where: { id: id }, // ID harus berupa angka (integer)
    });

    if (!masterAsuransi) {
      throw new HttpException(
        `Data asuransi dengan ID ${id} tidak ditemukan.`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Periksa ID Fasyankes jika disertakan
    if (data.idFasyankes && data.idFasyankes !== masterAsuransi.idFasyankes) {
      throw new HttpException(
        `ID Fasyankes ${data.idFasyankes} tidak cocok dengan data asuransi.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Update data asuransi
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
      message: `Data asuransi dengan ID ${id} berhasil diperbarui.`,
      data: updatedAsuransi,
    };
  } catch (error) {
    if (error instanceof HttpException) {
      throw error;
    }

    throw new HttpException(
      `Gagal memperbarui data asuransi: ${error.message}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

  
  

  async deleteAsuransi(id: number, idFasyankes: string): Promise<{ message: string }> {
    try {
      const masterAsuransi = await this.prisma.masterAsuransi.findFirst({
        where: { id: id, idFasyankes: idFasyankes },
      });

      if (!masterAsuransi) {
        throw new HttpException(
          `Data asuransi dengan ID ${id} dan ID Fasyankes ${idFasyankes} tidak ditemukan.`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Menghapus data
      await this.prisma.masterAsuransi.delete({
        where: { id: id },
      });

      return {
        message: `Data asuransi dengan ID ${id} berhasil dihapus.`,
      };
    } catch (error) {
      throw new HttpException(
        `Gagal menghapus data asuransi: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
