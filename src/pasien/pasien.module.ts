import { Module } from '@nestjs/common';
import { PasienService } from './pasien.service';
import { PasienController } from './pasien.controller';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  controllers: [PasienController],
  providers: [PasienService],
  imports: [PrismaModule]
})
export class PasienModule { }
