import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { DoctorsService } from './doctors.service';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    const data = await this.doctorsService.findAll();
    if (data.length < 1) {
      return {
        success: true,
        data: [],
      };
    }
    return { success: true, data: data };
  }
}
