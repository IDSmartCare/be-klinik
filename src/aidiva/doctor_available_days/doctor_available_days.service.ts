import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class DoctorAvailableDaysService {
  constructor(private prisma: PrismaService) {}

  async findAvailableDaysDoctor(doctorId: number) {
    const doctor = await this.prisma.doctors.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new HttpException(
        { success: false, message: 'Doctor not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const data = await this.prisma.doctorAvailableDays.findMany({
      where: { doctorId },
    });

    if (data.length === 0) {
      throw new HttpException(
        { success: false, message: 'No available days for this doctor' },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      data,
    };
  }
}
