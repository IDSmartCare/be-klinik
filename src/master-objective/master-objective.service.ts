/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MasterObjective, Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateMasterObjectiveDto } from './dto/create-master-objective.dto';

@Injectable()
export class MasterObjectiveService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<MasterObjective[]> {
        return this.prisma.masterObjective.findMany();
    }

    async createObjective(
        data: CreateMasterObjectiveDto,
    ): Promise<MasterObjective> {
        return await this.prisma.masterObjective.create({
            data: {
                idFasyankes: data.idFasyankes,
                text: data.text,
                createdBy: new Date(),
            },
        });
    }

    async updateObjective(params: {
        where: Prisma.MasterObjectiveWhereUniqueInput;
        data: Prisma.MasterObjectiveUpdateInput;
    }): Promise<MasterObjective> {
        const { where, data } = params;
        return this.prisma.masterObjective.update({
            where,
            data,
        });
    }

    async deleteUser(where: Prisma.MasterObjectiveWhereUniqueInput): Promise<MasterObjective> {
        return this.prisma.masterObjective.delete({
            where,
        });
    }
}