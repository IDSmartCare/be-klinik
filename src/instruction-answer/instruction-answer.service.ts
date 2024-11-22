import { Injectable } from '@nestjs/common';
import { CreateAssessmentAnswerDto } from 'src/assessment-answer/dto/create-assessment-answer.dto';
import { PrismaService } from 'src/service/prisma.service';
import { CreateInstructionDto } from './dto/create-instruction-answer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class InstructionAnswerService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateInstructionDto) {
        const { questionId, answer, createdBy } = data;

        const existingQuestion = await this.prisma.masterInstruction.findUnique({
            where: { id: questionId },
        });

        if(!existingQuestion) {
            throw new Error(`MasterInstruction record with ID ${questionId} not found.`);
        }

        return this.prisma.instructionAnswer.create({
            data: {
                question: {
                    connect: { id: questionId },
                },
                answer,
                createdBy
            },
        });
    }


    async findAll() {
        return this.prisma.instructionAnswer.findMany();
    }

    async findOne(id: number) {
        return this.prisma.instructionAnswer.findUnique({
            where: { id },
        });
    }

    async update(id: number, data: Prisma.InstructionAnswerUpdateInput) {
        return this.prisma.instructionAnswer.update({
            where: { id },
            data,
        });
    }


    async delete(id: number) {
        return this.prisma.instructionAnswer.delete({
            where: { id },
        });
    }
}
