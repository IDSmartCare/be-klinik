import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AntrianService } from './antrian.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAntrianAdmisiDto } from './dto/create-admisi.dto';

@Controller('antrian')
export class AntrianController {
  constructor(private readonly antrianService: AntrianService) {}

  @UseGuards(AuthGuard)
  @Get('/admisi/:id/:idFasyankes')
  async findOne(
    @Param('id') id: string,
    @Param('idFasyankes') idFasyankes: string,
  ) {
    const idAsNumber = parseInt(id, 10);
    return this.antrianService.panggilAntrianAdmisi(idAsNumber, idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Post('/store-admisi')
  async storeAntrianAdmisi(@Body() dto: CreateAntrianAdmisiDto) {
    return await this.antrianService.storeAntrianAdmisi(dto);
  }
  @UseGuards(AuthGuard)
  @Get('/pasien/:id/:idFasyankes')
  async panggilAntrianPasien(
    @Param('id') id: number,
    @Param('idFasyankes') idFasyankes: string,
  ) {
    return this.antrianService.panggilAntrianPasien(id, idFasyankes);
  }
}
