/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MasterSubjective, Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateMasterSubjectiveDto } from './dto/create-master-subjective.dto';

@Injectable()
export class MasterSubjectiveService {
  constructor(private prisma: PrismaService) {}

  // ambil semua data
  async findAll(): Promise<MasterSubjective[]> {
    return this.prisma.masterSubjective.findMany();
  }

  // Buat entri baru
  async createSubjective(
    data: CreateMasterSubjectiveDto,
  ): Promise<MasterSubjective> {
    return await this.prisma.masterSubjective.create({
      data: {
        idFasyankes: data.idFasyankes,
        text: data.text,
        createdBy: new Date(),
      },
    });
  }

  async updateSubjective(params: {
    where: Prisma.MasterSubjectiveWhereUniqueInput;
    data: Prisma.MasterSubjectiveUpdateInput;
  }): Promise<MasterSubjective> {
    const { where, data } = params;
    return this.prisma.masterSubjective.update({
      where,
      data,
    });
  }

  async deleteUser(
    where: Prisma.MasterSubjectiveWhereUniqueInput,
  ): Promise<MasterSubjective> {
    return this.prisma.masterSubjective.delete({
      where,
    });
  }
}
