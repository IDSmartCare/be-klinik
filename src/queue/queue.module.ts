import { Module } from '@nestjs/common';
import { QueueGateway } from './queue.gateway';
import { AntrianService } from '../antrian/antrian.service'; // Adjust the path accordingly
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  providers: [AntrianService, QueueGateway],
  exports: [QueueGateway],
  imports: [PrismaModule],
})
export class QueueModule {}
