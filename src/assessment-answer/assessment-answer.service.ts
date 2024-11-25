import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { CreateAssessmentAnswerDto } from './dto/create-assessment-answer.dto';
import { Prisma } from '@prisma/client';
import { UpdateAssessmentAnswerDto } from './dto/update-assessment-answer.dto';

@Injectable()
export class AssessmentAnswerService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateAssessmentAnswerDto) {
        const { questionId, answer, createdBy } = data;

        const existingQuestion = await this.prisma.masterAssessment.findUnique({
            where: { id: questionId },
        });

        if (!existingQuestion) {
            throw new Error(
                `MasterAssessment record with ID ${questionId} not fouund. `,
            );
        }

        return this.prisma.assessmentAnswer.create({
            data: {
                question: {
                    connect: { id: questionId },
                },
                answer,
                createdBy,
            }
        })
    }

    async findAll() {
        return this.prisma.assessmentAnswer.findMany();
    }

    async findOne( id: number) {
        return this.prisma.assessmentAnswer.findUnique({
            where: { id }
        });
    }

    async update(id: number, data: UpdateAssessmentAnswerDto) {
        return this.prisma.assessmentAnswer.update({
            where: { id },
            data,
        });
    }

    async delete(id: number) {
        return this.prisma.assessmentAnswer.delete({
            where: { id },
        });
    }
}
