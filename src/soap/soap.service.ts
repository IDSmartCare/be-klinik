import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class SoapService {
  constructor(private prisma: PrismaService) {}

  async getAllCombinedData(idFasyankes: string) {
    const subjectiveData = await this.prisma.masterSubjective.findMany({
      where: { idFasyankes },
      select: {
        id: true,
        category: true,
        question: true,
        createdAt: true,
        createdBy: true,
        questionType: true,
      },
    });

    const objectiveData = await this.prisma.masterObjective.findMany({
      where: { idFasyankes },
      select: {
        id: true,
        category: true,
        question: true,
        createdAt: true,
        createdBy: true,
        questionType: true,
      },
    });

    const assessmentData = await this.prisma.masterAssessment.findMany({
      where: { idFasyankes },
      select: {
        id: true,
        category: true,
        question: true,
        createdAt: true,
        createdBy: true,
        questionType: true,
      },
    });

    const planData = await this.prisma.masterPlan.findMany({
      where: { idFasyankes },
      select: {
        id: true,
        category: true,
        question: true,
        createdAt: true,
        createdBy: true,
        questionType: true,
      },
    });

    const instructionData = await this.prisma.masterInstruction.findMany({
      where: { idFasyankes },
      select: {
        id: true,
        category: true,
        question: true,
        createdAt: true,
        createdBy: true,
        questionType: true,
      },
    });

    // Combine all data
    const combinedData = [
      ...subjectiveData.map((item) => ({ ...item, source: 'Subjective' })),
      ...objectiveData.map((item) => ({ ...item, source: 'Objective' })),
      ...assessmentData.map((item) => ({ ...item, source: 'Assessment' })),
      ...planData.map((item) => ({ ...item, source: 'Plan' })),
      ...instructionData.map((item) => ({ ...item, source: 'Instruction' })),
    ];

    // Sort by createdAt in descending order
    combinedData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return combinedData;
  }
}
