/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MasterAssessment, Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateMasterAssessmentDto } from './dto/create-master-assessment.dto';

@Injectable()
export class MasterAssessmentService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<MasterAssessment[]> {
        return this.prisma.masterAssessment.findMany();
    }


    async createAssessment(
        data: CreateMasterAssessmentDto,
    ): Promise<MasterAssessment> {
        return await this.prisma.masterAssessment.create({
            data: {
                idFasyankes: data.idFasyankes,
                text: data.text,
                createdBy: new Date(),
            },
        });
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