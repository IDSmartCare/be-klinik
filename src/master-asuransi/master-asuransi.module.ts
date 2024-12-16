import { Module } from '@nestjs/common';
import { MasterAsuransiController } from './master-asuransi.controller';
import { MasterAsuransiService } from './master-asuransi.service';
import { PrismaService } from 'src/service/prisma.service';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  controllers: [MasterAsuransiController],
  providers: [MasterAsuransiService, PrismaService],
  imports: [PrismaModule],
})
export class MasterAsuransiModule {}
