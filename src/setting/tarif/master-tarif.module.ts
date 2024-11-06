/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MasterTarifService } from './master-tarif.service';
import { MasterTarifController } from './master-tarif.controller';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  controllers: [MasterTarifController],
  providers: [MasterTarifService],
  imports: [PrismaModule],
})
export class MasterTarifModule {}
