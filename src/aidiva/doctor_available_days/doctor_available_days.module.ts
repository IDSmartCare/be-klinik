import { Module } from '@nestjs/common';
import { DoctorAvailableDaysService } from './doctor_available_days.service';
import { DoctorAvailableDaysController } from './doctor_available_days.controller';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  providers: [DoctorAvailableDaysService],
  controllers: [DoctorAvailableDaysController],
  imports: [PrismaModule],
})
export class DoctorAvailableDaysModule {}
