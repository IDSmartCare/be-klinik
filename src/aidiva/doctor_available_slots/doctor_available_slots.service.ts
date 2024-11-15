import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DoctorAvailableSlots } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class DoctorAvailableSlotsService {
  constructor(private prisma: PrismaService) {}

  async findAvailableDaysDoctor(
    doctorId: number,
  ): Promise<DoctorAvailableSlots[]> {
    try {
      const data = await this.prisma.doctorAvailableSlots.findMany({
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
