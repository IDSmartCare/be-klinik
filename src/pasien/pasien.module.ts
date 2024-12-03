/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PasienService } from './pasien.service';
import { PasienController } from './pasien.controller';
import { PrismaModule } from 'src/service/prisma.module';
import { QueueModule } from 'src/queue/queue.module';
import { DoctorsModule } from 'src/doctors/doctors.module';

@Module({
  controllers: [PasienController],
  providers: [PasienService],
  imports: [PrismaModule, QueueModule, DoctorsModule],
  exports: [PasienService],
})
export class PasienModule {}
