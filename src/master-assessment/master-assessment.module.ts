/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MasterAssessmentController } from './master-assessment.controller';
import { MasterAssessmentService } from './master-assessment.service';
import { PrismaService } from 'src/service/prisma.service';

@Module({
    controllers: [MasterAssessmentController],
    providers: [MasterAssessmentService, PrismaService],
    imports: [],

})
export class MasterAssessmentModule {}
