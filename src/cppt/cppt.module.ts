import { Module } from '@nestjs/common';
import { CpptService } from './cppt.service';
import { CpptController } from './cppt.controller';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  controllers: [CpptController],
  providers: [CpptService],
  imports: [PrismaModule]
})
export class CpptModule { }
