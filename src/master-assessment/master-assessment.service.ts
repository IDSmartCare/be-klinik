/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { MasterAssessment, Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateMasterAssessmentDto } from './dto/create-master-assessment.dto';

@Injectable()
export class MasterAssessmentService {
  constructor(private prisma: PrismaService) {}

  async getAssessment(idFasyankes: string) {
    try {
      const assessment = await this.prisma.masterAssessment.findMany({
        where: { idFasyankes },
      });

      if (assessment.length === 0) {
        throw new Error('Assessment not found for this Fasyankes');
      }

      return assessment;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // async findAll(): Promise<MasterAssessment[]> {
  //     return this.prisma.masterAssessment.findMany();
  // }

  async createAssessment(
    data: CreateMasterAssessmentDto,
  ): Promise<MasterAssessment> {
    return await this.prisma.masterAssessment.create({
      data: {
        idFasyankes: data.idFasyankes,
        questionType: data.questionType,
        category: data.category,
        question: data.question,
        createdBy: data.createdBy,
      },
    });
  }

  async getAssessmentDetail(id: number): Promise<MasterAssessment> {
    try {
      const assessment = await this.prisma.masterAssessment.findUnique({
        where: { id },
        include: { keyword: true },
      });

      if (!assessment) {
        throw new NotFoundException(`Assessment with ID ${id} not found`);
      }

      return assessment;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async updateAssessment(params: {
    where: Prisma.MasterAssessmentWhereUniqueInput;
    data: Prisma.MasterAssessmentUpdateInput;
  }): Promise<MasterAssessment> {
    const { where, data } = params;
    return this.prisma.masterAssessment.update({
      where,
      data,
    });
  }

  async deleteAssessment(
    where: Prisma.MasterAssessmentWhereUniqueInput,
  ): Promise<MasterAssessment> {
    return this.prisma.masterAssessment.delete({
      where,
    });
  }
}
