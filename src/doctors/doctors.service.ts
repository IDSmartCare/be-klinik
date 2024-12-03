import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { Doctors } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateDokterDto } from './dto/create-dokter.dto';
import { UpdateDokterDto } from './dto/update-dokter.dto';
import { UpdatePoliKlinikDto } from './dto/update-poliKlinik.dto';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async findOneByProfile(idProfile: number): Promise<{ id: number } | null> {
    return this.prisma.doctors.findFirst({
      where: { idProfile },
      select: { id: true },
    });
  }

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

  async updateDoctorStatus(id: number, isAktif: boolean): Promise<Doctors> {
    const doctorId = Number(id);
    return this.prisma.doctors.update({
      where: {
        id: doctorId,
      },
      data: {
        isAktif: isAktif,
      },
    });
  }

  async updateDokter(
    id: number,
    updateDokterDto: UpdateDokterDto,
    updatePoliKlinikDto: UpdatePoliKlinikDto,
  ) {
    const doctor = await this.prisma.doctors.findUnique({ where: { id } });
    if (!doctor) {
      throw new NotFoundException(`Doctor with id ${id} not found`);
    }

    const updatedDoctor = await this.prisma.doctors.update({
      where: { id },
      data: {
        ...updateDokterDto,
        poliKlinik: {
          update: updatePoliKlinikDto,
        },
      },
    });

    return updatedDoctor;
  }
}
