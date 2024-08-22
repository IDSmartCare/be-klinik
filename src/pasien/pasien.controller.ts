import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { PasienService } from './pasien.service';
import { Pasien as PasienModel } from '@prisma/client';
import { CreatePasienDto } from './dto/create-pasien.dto';
import { UpdatePasienDto } from './dto/update-pasien.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('pasien')
export class PasienController {
  constructor(private readonly pasienService: PasienService) { }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() pasien: CreatePasienDto): Promise<PasienModel> {
    return this.pasienService.create(pasien);
  }

  @UseGuards(AuthGuard)
  @Get("/:idfasyankes")
  async findAll(@Param("idfasyankes") idfasyankes: string): Promise<PasienModel[]> {
    return this.pasienService.findAll({
      where: {
        idFasyankes: idfasyankes
      },
      orderBy: {
        id: 'desc'
      },
      take: 150
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pasienService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePasienDto: UpdatePasienDto): Promise<PasienModel> {
    return this.pasienService.update({
      where: {
        id: Number(id)
      },
      data: updatePasienDto
    });
  }
}
