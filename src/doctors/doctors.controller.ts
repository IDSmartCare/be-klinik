import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateDokterDto } from './dto/create-dokter.dto';
import { Doctors } from '@prisma/client';
import { UpdateDoctorStatusDto } from './dto/update-doctors.dto';
import { UpdatePoliKlinikDto } from './dto/update-poliKlinik.dto';
import { UpdateDokterDto } from './dto/update-dokter.dto';
@Controller('dokter')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @UseGuards(AuthGuard)
  @Get('/listdokter/:idFasyankes')
  async findAllDokter(@Param('idFasyankes') idFasyankes: string) {
    return this.doctorsService.findAllDokter(idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Post('/createdokter')
  async create(@Body() createDokter: CreateDokterDto): Promise<Doctors> {
    return this.doctorsService.createDokter(createDokter);
  }

  @UseGuards(AuthGuard)
  @Patch('/updatestatus/:id')
  async updateStatus(
    @Param('id') id: number,
    @Body() updateDoctorStatusDto: UpdateDoctorStatusDto,
  ) {
    const { isAktif } = updateDoctorStatusDto;
    return this.doctorsService.updateDoctorStatus(id, isAktif);
  }

  @UseGuards(AuthGuard)
  @Patch('/editdokter/:id')
  async editDokter(
    @Param('id') id: number,
    @Body() updateDokterDto: UpdateDokterDto,
    @Body('poliklinik') updatePoliKlinikDto: UpdatePoliKlinikDto,
  ) {
    return this.doctorsService.updateDokter(
      id,
      updateDokterDto,
      updatePoliKlinikDto,
    );
  }
}
