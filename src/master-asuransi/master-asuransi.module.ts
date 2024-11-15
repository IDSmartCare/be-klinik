import { Module } from '@nestjs/common';
import { MasterAsuransiController } from './master-asuransi.controller';
import { MasterAsuransiService } from './master-asuransi.service';
import { PrismaService } from 'src/service/prisma.service';

@Module({
    controllers: [MasterAsuransiController],
    providers: [MasterAsuransiService, PrismaService]
})
export class MasterAsuransiModule {}
