import { Module } from '@nestjs/common';
import { JadwalDokterService } from './jadwal-dokter.service';
import { JadwalDokterController } from './jadwal-dokter.controller';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  providers: [JadwalDokterService],
  controllers: [JadwalDokterController],
  imports: [PrismaModule],
})
export class JadwalDokterModule {}
