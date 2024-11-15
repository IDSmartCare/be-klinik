import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.doctors.findMany();

    const modifiedData = data.map((doctor) => {
      if (!doctor.avatar) {
        doctor.avatar = process.env.AVATAR_DUMMY;
      }
      return doctor;
    });

    return {
      success: true,
      data: modifiedData,
    };
  }
}
