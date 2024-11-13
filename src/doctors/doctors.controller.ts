import { Controller, Get, Param, UseGuards, Post, Body } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateDokterDto } from './dto/create-dokter.dto';
import { Doctors } from '@prisma/client';

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
}
