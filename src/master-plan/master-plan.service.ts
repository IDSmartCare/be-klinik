/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MasterPlan, Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateMasterPlanDto } from './dto/create-master-plan.dto';

@Injectable()
export class MasterPlanService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<MasterPlan[]> {
        return this.prisma.masterPlan.findMany();
    }

    async createPlan(
        data: CreateMasterPlanDto,
    ): Promise<MasterPlan> {
        return await this.prisma.masterPlan.create({
            data: {
                idFasyankes: data.idFasyankes,
                text: data.text,
                createdBy: new Date(),
            },
        });
    }

    async updatePlan(params: {
        where: Prisma.MasterPlanWhereUniqueInput;
        data: Prisma.MasterPlanUpdateInput;
    }): Promise<MasterPlan> {
        const { where, data } = params;
        return this.prisma.masterPlan.update({
            where,
            data,
        });
    }

    async deletePlan(where: Prisma.MasterPlanWhereUniqueInput): Promise<MasterPlan> {
        return this.prisma.masterPlan.delete({
            where,
        });
    }
}
