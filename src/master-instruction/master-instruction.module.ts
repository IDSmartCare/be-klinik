import { Module } from '@nestjs/common';
import { MasterInstructionService } from './master-instruction.service';
import { MasterInstructionController } from './master-instruction.controller';
import { PrismaService } from 'src/service/prisma.service';

@Module({
  providers: [MasterInstructionService, PrismaService],
  controllers: [MasterInstructionController],
})
export class MasterInstructionModule {}
