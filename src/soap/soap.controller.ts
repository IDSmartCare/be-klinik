import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { SoapService } from './soap.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('soap')
export class SoapController {
  constructor(private readonly soapService: SoapService) {}

  @UseGuards(AuthGuard)
  @Get('/all/:idFasyankes')
  async getAllSOAP(@Param('idFasyankes') idFasyankes: string) {
    return this.soapService.getAllCombinedData(idFasyankes);
  }
}
