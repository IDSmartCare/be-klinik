import { Module } from '@nestjs/common';
import { DoctorCostsService } from './doctor_costs.service';
import { DoctorCostsController } from './doctor_costs.controller';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  providers: [DoctorCostsService],
  controllers: [DoctorCostsController],
  imports: [PrismaModule],
})
export class DoctorCostsModule {}
