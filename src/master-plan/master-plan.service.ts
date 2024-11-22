/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { MasterPlan, Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateMasterPlanDto } from './dto/create-master-plan.dto';

@Injectable()
export class MasterPlanService {
  constructor(private prisma: PrismaService) {}

  async getPlan(idFasyankes: string) {
    try {
      const plan = await this.prisma.masterPlan.findMany({
        where: { idFasyankes },
      });

      if (plan.length === 0) {
        throw new Error('Plan not found for this Fasyankes');
      }

      return plan;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // async findAll(): Promise<MasterPlan[]> {
  //     return this.prisma.masterPlan.findMany();
  // }

  async createPlan(data: CreateMasterPlanDto): Promise<MasterPlan> {
    return await this.prisma.masterPlan.create({
      data: {
        idFasyankes: data.idFasyankes,
        questionType: data.questionType,
        category: data.category,
        question: data.question,
        createdBy: data.createdBy,
      },
    });
  }

  async getPlanDetail(id: number): Promise<MasterPlan> {
    try {
      const plan = await this.prisma.masterPlan.findUnique({
        where: { id },
        include: { keyword: true },
      });

      if (!plan) {
        throw new NotFoundException(`Plan with ID ${id} not found`);
      }

      return plan;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updatePlan(params: {
    where: Prisma.MasterPlanWhereUniqueInput;
    data: Prisma.MasterPlanUpdateInput;
  }): Promise<MasterPlan> {
    const { where, data } = params;
    return this.prisma.masterPlan.update({
      where,
      data,
    });
  }

  async deletePlan(
    where: Prisma.MasterPlanWhereUniqueInput,
  ): Promise<MasterPlan> {
    return this.prisma.masterPlan.delete({
      where,
    });
  }
}
