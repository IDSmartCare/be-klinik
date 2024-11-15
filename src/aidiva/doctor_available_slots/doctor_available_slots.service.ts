import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class DoctorAvailableSlotsService {
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

    const data = await this.prisma.doctorAvailableSlots.findMany({
      where: { doctorId },
    });

    if (data.length === 0) {
      throw new HttpException(
        { success: false, message: 'No available slots for this doctor' },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      success: true,
      data,
    };
  }
}
