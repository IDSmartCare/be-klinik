/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { MasterTarifService } from './master-tarif.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('master-tarif')
export class MasterTarifController {
  constructor(private readonly masterTarifService: MasterTarifService) {}

  @Get(':idFasyankes')
  async getTarif(@Param('idFasyankes') idFasyankes: string) {
    return this.masterTarifService.getTarif(idFasyankes);
  }

  @Post('/create')
  async createTarif(
    @Body()
    data: {
      idFasyankes: string;
      namaTarif: string;
      kategoriTarif: string;
      hargaTarif?: string;
      penjamin: string;
      isAktif?: boolean;
    },
  ) {
    return this.masterTarifService.createTarif(data);
  }
}
