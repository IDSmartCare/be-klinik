import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { KasirService } from './kasir.service';
import { CreateKasirDto } from './dto/create-kasir.dto';
import { PembayaranPasien } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('kasir')
export class KasirController {
  constructor(private readonly kasirService: KasirService) { }

  @UseGuards(AuthGuard)
  @Post("/pembayaran")
  async create(@Body() createKasirDto: CreateKasirDto): Promise<PembayaranPasien> {
    return this.kasirService.createPembayaran(createKasirDto);
  }

  @UseGuards(AuthGuard)
  @Get('/getbyidpendaftaran/:id')
  findOne(@Param('id') id: string) {
    return this.kasirService.findOneByPendaftaranId({
      where: {
        pendaftaranId: Number(id)
      },
      include: {
        billPasienDetail: true
      }
    });
  }
}
