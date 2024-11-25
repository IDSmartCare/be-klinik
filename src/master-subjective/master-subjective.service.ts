/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { MasterSubjective, Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateMasterSubjectiveDto } from './dto/create-master-subjective.dto';
import { UpdateMasterSubjectiveDto } from './dto/update-master-subjective.dto';

@Injectable()
export class MasterSubjectiveService {
  constructor(private prisma: PrismaService) {}

  async getSubjective(idFasyankes: string) {
    try {
      const subjective = await this.prisma.masterSubjective.findMany({
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

  async getSubjectiveDetail(id: number): Promise<MasterSubjective> {
    try {
      const subjective = await this.prisma.masterSubjective.findUnique({
        where: { id },
        include: {
          keyword: {
            include: {
              question: {
                select: {
                  category: true,
                },
              },
            },
          },
        },
      });

      if (!subjective) {
        throw new NotFoundException(`Subjective with ID ${id} not found`);
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

  async createSubjective(
    data: CreateMasterSubjectiveDto,
  ): Promise<MasterSubjective> {
    return await this.prisma.masterSubjective.create({
      data: {
        idFasyankes: data.idFasyankes,
        questionType: data.questionType,
        category: data.category,
        question: data.question,
        createdBy: data.createdBy,
      },
    });
  }

  async updateSubjective(
    where: { id: number },
    data: UpdateMasterSubjectiveDto,
  ): Promise<MasterSubjective> {
    try {
      return await this.prisma.masterSubjective.update({
        where,
        data: data,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteUser(
    where: Prisma.MasterSubjectiveWhereUniqueInput,
  ): Promise<MasterSubjective> {
    return this.prisma.masterSubjective.delete({
      where,
    });
  }
}
