import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { DoctorAvailableDays } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class DoctorAvailableDaysService {
  constructor(private prisma: PrismaService) {}

  async findAvailableDaysDoctor(
    doctorId: number,
  ): Promise<DoctorAvailableDays[]> {
    try {
      const data = await this.prisma.doctorAvailableDays.findMany({
        where: {
          doctorId,
        },
      });

      if (!data || data.length === 0) {
        throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
      }

      return data;
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while fetching data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
