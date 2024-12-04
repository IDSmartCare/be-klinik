import { Module } from '@nestjs/common';
import { PoliService } from './poli.service';
import { PoliController } from './poli.controller';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  controllers: [PoliController],
  providers: [PoliService],
  imports: [PrismaModule]
})
export class PoliModule {}
