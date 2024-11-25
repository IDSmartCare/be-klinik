import { Module } from '@nestjs/common';
import { AntrianController } from './antrian.controller';
import { AntrianService } from './antrian.service';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  controllers: [AntrianController],
  providers: [AntrianService],
  imports: [PrismaModule],
})
export class AntrianModule {}
