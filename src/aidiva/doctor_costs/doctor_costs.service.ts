import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class DoctorCostsService {
  constructor(private prisma: PrismaService) {}

  async findDoctorCosts(doctorId: number) {
    const doctor = await this.prisma.doctors.findUnique({
      where: { id: doctorId },
    });
    if (!doctor) {
      throw new HttpException(
        { success: false, message: 'Doctor not found' },
        HttpStatus.NOT_FOUND,
      );
    }

    const data = await this.prisma.doctorCosts.findFirst({
      where: { doctorId },
    });

    if (!data) {
      throw new HttpException(
        { success: false, message: 'No costs available for this doctor' },
        HttpStatus.NOT_FOUND,
      );
    }

    const formattedData = {
      id: data.id,
      doctorId: data.doctorId,
      base_fee: Number(data.baseFee),
      extra_fee: {
        emergency: Number(data.emergency),
        consultation: Number(data.consultation),
      },
    };

    return { success: true, data: formattedData };
  }
}
