/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MasterSubjectiveController } from './master-subjective.controller';
import { MasterSubjectiveService } from './master-subjective.service';
import { PrismaService } from 'src/service/prisma.service';

@Module({
  controllers: [MasterSubjectiveController],
  providers: [MasterSubjectiveService, PrismaService],
  imports: [],
})
export class MasterSubjectiveModule {}
