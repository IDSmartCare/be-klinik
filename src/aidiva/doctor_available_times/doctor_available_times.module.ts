import { Module } from '@nestjs/common';
import { DoctorAvailableTimesService } from './doctor_available_times.service';
import { DoctorAvailableTimesController } from './doctor_available_times.controller';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  providers: [DoctorAvailableTimesService],
  controllers: [DoctorAvailableTimesController],
  imports: [PrismaModule],

})
export class DoctorAvailableTimesModule {}
