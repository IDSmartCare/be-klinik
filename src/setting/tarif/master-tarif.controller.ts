/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { MasterTarifService } from './master-tarif.service';

@Controller('master-tarif')
export class MasterTarifController {
  constructor(private readonly masterTarifService: MasterTarifService) {}

  @Get(':idFasyankes')

  async getTarif(@Param('idFasyankes') idFasyankes: string) {
    return this.masterTarifService.getTarif(idFasyankes);
  }

  @Post()
  async createTarif(@Body() data: any) {
    return this.masterTarifService.createTarif(data);
  }
}