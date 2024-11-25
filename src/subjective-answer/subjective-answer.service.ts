// src/subjective-answer/subjective-answer.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { CreateSubjectiveAnswerDto } from './dto/create-subjective-answer.dto';
import { UpdateSubjectiveAnswerDto } from './dto/update-subjective-answer.dto';

@Injectable()
export class SubjectiveAnswerService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSubjectiveAnswerDto) {
    const { questionId, answer, createdBy } = data;

    const existingQuestion = await this.prisma.masterSubjective.findUnique({
      where: { id: questionId },
    });

    if (!existingQuestion) {
      throw new Error(
        `MasterSubjective record with ID ${questionId} not found.`,
      );
    }

    // Proceed with creating the answer if the question exists
    return this.prisma.subjectiveAnswer.create({
      data: {
        question: {
          connect: { id: questionId },
        },
        answer,
        createdBy,
      },
    });
  }

  async findAll() {
    return this.prisma.subjectiveAnswer.findMany();
  }

  async findOne(id: number) {
    return this.prisma.subjectiveAnswer.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: UpdateSubjectiveAnswerDto) {
    return this.prisma.subjectiveAnswer.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return this.prisma.subjectiveAnswer.delete({
      where: { id },
    });
  }
}
