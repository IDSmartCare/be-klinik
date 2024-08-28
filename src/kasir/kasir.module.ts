import { Module } from '@nestjs/common';
import { KasirService } from './kasir.service';
import { KasirController } from './kasir.controller';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  controllers: [KasirController],
  providers: [KasirService],
  imports: [PrismaModule]
})
export class KasirModule { }
