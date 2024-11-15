import { Module } from '@nestjs/common';
import { DoctorAvailableSlotsService } from './doctor_available_slots.service';
import { DoctorAvailableSlotsController } from './doctor_available_slots.controller';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  providers: [DoctorAvailableSlotsService],
  controllers: [DoctorAvailableSlotsController],
  imports: [PrismaModule],
})
export class DoctorAvailableSlotsModule {}
