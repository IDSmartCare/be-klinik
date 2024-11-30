import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DoctorAvailableTimesService } from './doctor_available_times.service';

@Controller('doctors')
export class DoctorAvailableTimesController {
  constructor(
    private readonly doctorAvailableTimesService: DoctorAvailableTimesService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/:doctorId/availability/times')
  async findAll(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.doctorAvailableTimesService.findAvailableTimesDoctor(doctorId);
  }
}
