import { Injectable } from '@nestjs/common';
import { CreateAssessmentAnswerDto } from 'src/assessment-answer/dto/create-assessment-answer.dto';
import { PrismaService } from 'src/service/prisma.service';
import { CreatePlanAnswerDto } from './dto/create-plan-answer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PlanAnswerService {
    constructor (private prisma: PrismaService) {}

    async create(data: CreatePlanAnswerDto) {
        const { questionId, answer, createdBy } = data;

        const existingQuestion = await this.prisma.masterPlan.findUnique({
            where: { id: questionId },
        });

        if (!existingQuestion) {
            throw new Error(
                `MasterPlan record with ID ${questionId} not found`,
            );
        }

        return this.prisma.planAnswer.create({
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
        return this.prisma.planAnswer.findMany();
    }

    async findOne(id: number) {
        return this.prisma.planAnswer.findUnique({
            where: { id },
        });
    }

    async update(id: number, data: Prisma.PlanAnswerUpdateInput) {
        return this.prisma.planAnswer.update({
            where: { id},
            data,
        })
    }

    async delete(id: number) {
        return this.prisma.planAnswer.delete({
            where: { id },
        });
    }
}
