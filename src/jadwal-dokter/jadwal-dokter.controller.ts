import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JadwalDokterService } from './jadwal-dokter.service';
import { CreateJadwalDokterDto } from './dto/create-jadwal-dokter.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateJadwalDokterDto } from './dto/update-jadwal-dokter.dto';

@Controller('dokter')
export class JadwalDokterController {
  constructor(private readonly jadwalDocterService: JadwalDokterService) {}

  @UseGuards(AuthGuard)
  @Get('/jadwaldokter/:idFasyankes')
  async findAllJadwalDokter(@Param('idFasyankes') idFasyankes: string) {
    return this.jadwalDocterService.listSchedule(idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Get('/listdokter/withoutavailability/:idFasyankes')
  async findAllDoctorsWithoutAvailability(
    @Param('idFasyankes') idFasyankes: string,
  ) {
    return this.jadwalDocterService.findAllDoctorsWithoutAvailability(
      idFasyankes,
    );
  }

  @UseGuards(AuthGuard)
  @Get('/jadwaldokter/:hari/:idFasyankes')
  async findJadwalDokterToday(
    @Param('hari') hari: string,
    @Param('idFasyankes') idFasyankes: string,
  ) {
    return this.jadwalDocterService.findJadwalDokterToday(idFasyankes, hari);
  }

  @UseGuards(AuthGuard)
  @Post('/createjadwal')
  async create(
    @Body() createJadwalDokterDto: CreateJadwalDokterDto,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    const result = await this.jadwalDocterService.createSchedule(
      createJadwalDokterDto,
    );

    if (!result.success) {
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @UseGuards(AuthGuard)
  @Get('/detailschedule/:idFasyankes/:idDokter')
  async getDetailSchedule(
    @Param('idFasyankes') idFasyankes: string,
    @Param('idDokter') idDokter: string,
  ) {
    return await this.jadwalDocterService.getDetailSchedule(
      idFasyankes,
      +idDokter,
    );
  }

  @UseGuards(AuthGuard)
  @Put('/updatejadwal/:availableDayId')
  async updateSchedule(
    @Param('availableDayId') availableDayId: string,
    @Body() updateJadwalDokterDto: UpdateJadwalDokterDto,
  ) {
    return await this.jadwalDocterService.updateSchedule(
      updateJadwalDokterDto,
      +availableDayId,
    );
  }
  @UseGuards(AuthGuard)
  @Delete('/deletejadwal/:availableDayId')
  async deleteSchedule(@Param('availableDayId') availableDayId: string) {
    const id = +availableDayId;
    if (isNaN(id)) {
      throw new BadRequestException(
        'ID hari yang tersedia harus berupa angka.',
      );
    }

    return await this.jadwalDocterService.deleteSchedule(id);
  }
}
