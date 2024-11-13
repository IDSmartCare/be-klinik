import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateDoctorStatusDto } from './dto/update-doctors.dto';

@Controller('dokter')
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

  @UseGuards(AuthGuard)
  @Patch('/updatestatus/:id')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateDoctorStatusDto: UpdateDoctorStatusDto,
  ) {
    const {isAktif} = updateDoctorStatusDto;
    return this.doctorsService.updateDoctorStatus(id, isAktif);
  }
}