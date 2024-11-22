import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { CreateObjectiveAnswerDto } from './dto/create-objective-answer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ObjectiveAnswerService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateObjectiveAnswerDto) {
        const { questionId, answer, createdBy} = data;

        const existingQuestion = await this.prisma.masterObjective.findUnique({
            where: { id: questionId },
        });

        if (!existingQuestion) {
            throw new Error(
                `MasterObjective record with ID ${questionId} no found`,
            );
        }

        return this.prisma.objectiveAnswer.create({
            data: {
                question: {
                    connect: { id: questionId},
                },
                answer,
                createdBy,
            }
        });
    }

    async findAll() {
        return this.prisma.objectiveAnswer.findMany();
    }

    async findOne(id: number) {
        return this.prisma.objectiveAnswer.findUnique({
            where: { id },
        });
    }

    async update(id: number, data: Prisma.ObjectiveAnswerUpdateInput) {
        return this.prisma.objectiveAnswer.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return this.prisma.objectiveAnswer.delete({
            where: { id}
        });
    }

    
}
