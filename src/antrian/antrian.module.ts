import { Module } from '@nestjs/common';
import { AntrianController } from './antrian.controller';
import { AntrianService } from './antrian.service';
import { PrismaModule } from 'src/service/prisma.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  controllers: [AntrianController],
  providers: [AntrianService],
  imports: [PrismaModule, QueueModule],
})
export class AntrianModule {}
