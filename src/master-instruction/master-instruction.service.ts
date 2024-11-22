/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { MasterInstruction, MasterSubjective, Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateMasterInstructionDto } from './dto/create-master-instruction.dto';

@Injectable()
export class MasterInstructionService {
  constructor(private prisma: PrismaService) {}

  async getInstruction(idFasyankes: string) {
    try {
      const subjective = await this.prisma.masterInstruction.findMany({
        where: { idFasyankes },
      });

      if (subjective.length === 0) {
        throw new Error('Subjective not found for this Fasyankes');
      }

      return subjective;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // async findAll(): Promise<MasterSubjective[]> {
  //   return this.prisma.masterSubjective.findMany();
  // }

  // Buat entri baru
  async createInstruction(
    data: CreateMasterInstructionDto,
  ): Promise<MasterSubjective> {
    return await this.prisma.masterInstruction.create({
      data: {
        idFasyankes: data.idFasyankes,
        questionType: data.questionType,
        category: data.category,
        question: data.question,
        createdBy: data.createdBy,
      },
    });
  }

  async getInstructionDetail(id: number): Promise<MasterInstruction> {
    try {
      const instruction = await this.prisma.masterInstruction.findUnique({
        where: { id },
        // include: { keyword: true },
      });

      if (!instruction) {
        throw new NotFoundException(`Instruction with ID ${id} not found`);
      }

      return instruction;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  //   async updateSubjective(params: {
  //     where: Prisma.MasterSubjectiveWhereUniqueInput;
  //     data: Prisma.MasterSubjectiveUpdateInput;
  //   }): Promise<MasterSubjective> {
  //     const { where, data } = params;
  //     return this.prisma.masterInstruction.update({
  //       where,
  //       data,
  //     });
  //   }

  //   async deleteUser(
  //     where: Prisma.MasterSubjectiveWhereUniqueInput,
  //   ): Promise<MasterSubjective> {
  //     return this.prisma.masterInstruction.delete({
  //       where,
  //     });
  //   }
}
