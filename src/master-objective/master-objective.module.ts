/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MasterObjectiveController } from './master-objective.controller';
import { MasterObjectiveService } from './master-objective.service';
import { PrismaService } from 'src/service/prisma.service';

@Module({
    controllers: [MasterObjectiveController],
    providers: [MasterObjectiveService, PrismaService],
    imports: []
})
export class MasterObjectiveModule {}
