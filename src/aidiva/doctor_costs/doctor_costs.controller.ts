import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { DoctorCostsService } from './doctor_costs.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('doctors')
export class DoctorCostsController {
  constructor(private readonly doctorCostsService: DoctorCostsService) {}

  @UseGuards(AuthGuard)
  @Get('/:doctorId/availability/costs')
  async findAll(@Param('doctorId', ParseIntPipe) doctorId: number) {
    return this.doctorCostsService.findDoctorCosts(doctorId);
  }
}
