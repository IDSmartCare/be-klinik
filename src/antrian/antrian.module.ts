import { Module } from '@nestjs/common';
import { AntrianController } from './antrian.controller';
import { AntrianService } from './antrian.service';
import { PrismaModule } from 'src/service/prisma.module';
import { QueueModule } from 'src/queue/queue.module';
import { PasienModule } from 'src/pasien/pasien.module';

@Module({
  controllers: [AntrianController],
  providers: [AntrianService],
  imports: [PrismaModule, QueueModule, PasienModule],
})
export class AntrianModule {}
