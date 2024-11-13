import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Doctors } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateDokterDto } from './dto/create-dokter.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async findAllDokter(
    idFasyankes: string,
  ): Promise<{ success: boolean; data?: Doctors[]; message: string }> {
    try {
      const data = await this.prisma.doctors.findMany({
        where: {
          idFasyankes,
        },
      });

      if (data.length === 0) {
        return {
          success: false,
          message: 'No doctors found for this Fasyankes',
        };
      }

      return { success: true, message: 'success get doctors', data };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createDokter(createDokterDto: CreateDokterDto): Promise<any> {
    try {
      const data = await this.prisma.doctors.create({
        data: createDokterDto,
      });

      return { success: true, message: 'Berhasil menambahkan Dokter' };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while storing the data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
