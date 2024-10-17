/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MasterTarifService } from './master-tarif.service';
import { MasterTarifController } from './master-tarif.controller';
import { PrismaService } from 'src/service/prisma.service';

@Module({
  controllers: [MasterTarifController],
  providers: [MasterTarifService, PrismaService],
})
export class MasterTarifModule {}
