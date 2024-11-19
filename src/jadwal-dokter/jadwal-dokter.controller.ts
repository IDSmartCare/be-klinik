import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JadwalDokterService } from './jadwal-dokter.service';
import { CreateJadwalDokterDto } from './dto/create-jadwal-dokter.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateJadwalDto } from 'src/setting/dto/update-setting.dto';
import { UpdateDoctorScheduleDto } from 'src/jadwal-dokter/dto/update-jadwal-dokter.dto';

@Controller('dokter')
export class JadwalDokterController {
  constructor(private readonly jadwalDocterService: JadwalDokterService) {}

  @UseGuards(AuthGuard)
  @Get('/jadwaldokter/:idFasyankes')
  async findAllJadwalDokter(@Param('idFasyankes') idFasyankes: string) {
    return this.jadwalDocterService.listSchedule(idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Get('/jadwaldokter/:hari/:idFasyankes')
  async findJadwalDokterToday(
    @Param('idFasyankes') idFasyankes: string,
    @Param('hari') hari: string,
  ) {
    return this.jadwalDocterService.findJadwalDokterToday(idFasyankes, hari);
  }

  @UseGuards(AuthGuard)
  @Post('/createjadwal')
  async create(@Body() createJadwalDokterDto: CreateJadwalDokterDto): Promise<{ success: boolean; message: string; data?: any }> {
    const result = await this.jadwalDocterService.createSchedule(createJadwalDokterDto);
  
    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
  
    return result;
  }
  

  //   @UseGuards(AuthGuard)
  //   @Patch('editjadwaldokter/:id')
  //   async update(@Param('id') id: number, @Body() updateDoctorScheduleDto: UpdateDoctorScheduleDto) {
  //     return this.jadwalDocterService.updateJadwalDokter(id, updateDoctorScheduleDto);
  //   }
}
