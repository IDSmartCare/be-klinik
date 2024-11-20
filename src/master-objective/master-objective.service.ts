/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MasterObjective, Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateMasterObjectiveDto } from './dto/create-master-objective.dto';

@Injectable()
export class MasterObjectiveService {
  constructor(private prisma: PrismaService) {}

  async getObjective(idFasyankes: string) {
    //     return this.prisma.masterObjective.findMany();
    //   }
    try {
      const objective = await this.prisma.masterObjective.findMany({
        where: { idFasyankes },
      });

      if (objective.length === 0) {
        throw new Error('Objective not found for this Fasyankes');
      }

      return objective;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createObjective(
    data: CreateMasterObjectiveDto,
  ): Promise<MasterObjective> {
    return await this.prisma.masterObjective.create({
      data: {
        idFasyankes: data.idFasyankes,
        questionType: data.questionType,
        category: data.category,
        question: data.question,
        createdBy: data.createdBy,
      },
    });
  }

  async updateObjective(params: {
    where: Prisma.MasterObjectiveWhereUniqueInput;
    data: Prisma.MasterObjectiveUpdateInput;
  }): Promise<MasterObjective> {
    const { where, data } = params;
    return this.prisma.masterObjective.update({
      where,
      data,
    });
  }

  async deleteUser(
    where: Prisma.MasterObjectiveWhereUniqueInput,
  ): Promise<MasterObjective> {
    return this.prisma.masterObjective.delete({
      where,
    });
  }
}
