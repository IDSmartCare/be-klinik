import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class DoctorAvailableTimesService {
  constructor(private prisma: PrismaService) {}

  async findAvailableTimesDoctor(doctorId: number) {
    const doctor = await this.prisma.doctors.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new HttpException(
        { success: false, message: 'Doctor not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const data = await this.prisma.doctorAvailableTimes.findMany({
      where: { doctorId },
      select: {
        id: true,
        from: true,
        to: true,
      },
    });

    if (data.length === 0) {
      throw new HttpException(
        { success: false, message: 'No availability found for this doctor' },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      data: {
        doctorId: doctorId,
        times: data.map(({ id, from, to }) => ({ id, from, to })),
      },
    };
  }
}
