import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DoctorAvailableSlotsService } from './doctor_available_slots.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('doctors')
export class DoctorAvailableSlotsController {
  constructor(
    private readonly doctorAvailableSlotsService: DoctorAvailableSlotsService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/:doctorId/availability/slots')
  async findAll(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.doctorAvailableSlotsService.findAvailableDaysDoctor(doctorId);
  }
}
