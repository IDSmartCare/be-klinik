import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JadwalDokterService } from './jadwal-dokter.service';
import { CreateJadwalDokterDto } from './dto/create-jadwal-dokter.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('dokter')
export class JadwalDokterController {
  constructor(private readonly jadwalDocterService: JadwalDokterService) {}

  @UseGuards(AuthGuard)
  @Get('/jadwaldokter/:idFasyankes')
  async findAllJadwalDokter(@Param('idFasyankes') idFasyankes: string) {
    return this.jadwalDocterService.listSchedule(idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Post('/createjadwal')
  async create(@Body() createJadwalDokterDto: CreateJadwalDokterDto) {
    return this.jadwalDocterService.createSchedule(createJadwalDokterDto);
  }
}
