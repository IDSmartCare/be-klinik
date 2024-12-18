/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { MasterTarifService } from './master-tarif.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { MasterTarif } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('master-tarif')
export class MasterTarifController {
  constructor(private readonly masterTarifService: MasterTarifService) {}

  @Get(':idFasyankes')
  async getTarif(@Param('idFasyankes') idFasyankes: string) {
    return this.masterTarifService.getTarif(idFasyankes);
  }

  @Get('/layanan/:idFasyankes/:idRegis')
  async getLayanan(
    @Param('idFasyankes') idFasyankes: string,
    @Param('idRegis') idRegis: string,
  ) {
    return this.masterTarifService.getLayanan(idFasyankes, +idRegis);
  }

  @Post('/create')
  async createTarif(
    @Body()
    data: {
      idFasyankes: string;
      doctorId?: number;
      namaTarif: string;
      kategoriTarif: string;
      hargaTarif?: string;
      penjamin?: string;
      isAktif?: boolean;
    },
  ) {
    return this.masterTarifService.createTarif(data);
  }

  @UseGuards(AuthGuard)
  @Get('/detailmastertarif/:id')
  async detailMasterTarif(@Param('id') id: string) {
    return this.masterTarifService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch('/update')
  async updateTarif(
    @Body()
    data: {
      id: number;
      namaTarif?: string;
      kategoriTarif?: string;
      hargaTarif?: string;
      doctorId?: number;
    },
  ) {
    return this.masterTarifService.updateTarif(data);
  }

  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  async deleteMasterTarif(
    @Param('id') id: string,
  ): Promise<{ message: string; data?: MasterTarif }> {
    return this.masterTarifService.deleteMasterTarif({ id: Number(id) });
  }
}
