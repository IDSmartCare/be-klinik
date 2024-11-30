import {
  Controller,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DoctorAvailableDaysService } from './doctor_available_days.service';

@Controller('doctors')
export class DoctorAvailableDaysController {
  constructor(
    private readonly doctorAvailableDaysService: DoctorAvailableDaysService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/:doctorId/availability/days')
  async findAll(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.doctorAvailableDaysService.findAvailableDaysDoctor(doctorId);
  }
}
