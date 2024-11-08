/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MasterPlanController } from './master-plan.controller';
import { MasterPlanService } from './master-plan.service';
import { PrismaService } from 'src/service/prisma.service';


@Module({
    controllers: [MasterPlanController],
    providers: [MasterPlanService, PrismaService],
    imports: []
})
export class MasterPlanModule {}
