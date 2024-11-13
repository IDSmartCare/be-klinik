import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class DoctorAvailableTimesService {
  constructor(private prisma: PrismaService) {}

  async findAvailableTimesDoctor(doctorId: number) {
    try {
      const data = await this.prisma.doctorAvailableTimes.findMany({
        where: {
          doctorId,
        },
        select: {
          from: true,
          to: true,
        },
      });

      if (!data || data.length === 0) {
        throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
      }
      return {
        doctor_id: doctorId,
        times: data.map(({ from, to }) => ({ from, to })),
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred while fetching data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
