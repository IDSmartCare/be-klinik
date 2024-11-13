import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
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
    try {
      const data =
        await this.doctorAvailableTimesService.findAvailableTimesDoctor(
          doctorId,
        );
      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
