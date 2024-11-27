import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AntrianService } from './antrian.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAntrianAdmisiDto } from './dto/create-admisi.dto';

@Controller('antrian')
export class AntrianController {
  constructor(private readonly antrianService: AntrianService) {}

  @UseGuards(AuthGuard)
  @Get('/admisi/:id')
  async findOne(@Param('id') id: string) {
    return this.antrianService.panggilAntrianAdmisi(+id);
  }

  @UseGuards(AuthGuard)
  @Get('/all/admisi/:idFasyankes')
  async getAllAntrianAdmisiToday(@Param('idFasyankes') idFasyankes: string) {
    return this.antrianService.getAllAntrianAdmisiToday(idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Post('/store-admisi')
  async storeAntrianAdmisi(@Body() dto: CreateAntrianAdmisiDto) {
    return await this.antrianService.storeAntrianAdmisi(dto);
  }
  @UseGuards(AuthGuard)
  @Get('/pasien/:id')
  async panggilAntrianPasien(@Param('id') id: string) {
    return this.antrianService.panggilAntrianPasien(+id);
  }
}
