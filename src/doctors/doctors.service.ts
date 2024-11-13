import { Injectable } from '@nestjs/common';
import { Doctors } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class DoctorsService {
    constructor(private prisma: PrismaService) {}


    
  async findAll(): Promise<Doctors[]> {
    return this.prisma.doctors.findMany();
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


}
