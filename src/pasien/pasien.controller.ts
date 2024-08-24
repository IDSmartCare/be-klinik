import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { PasienService } from './pasien.service';
import { EpisodePendaftaran, Pasien as PasienModel } from '@prisma/client';
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
  @Get(":idfasyankes")
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

  @UseGuards(AuthGuard)
  @Get('/byid/:id')
  async findOne(@Param('id') id: string): Promise<PasienModel> {
    return this.pasienService.findOne({
      where: {
        id: Number(id)
      }
    });
  }

  @UseGuards(AuthGuard)
  @Get('/riwayatregistrasi/:id')
  async riwayatRegis(@Param('id') id: string): Promise<EpisodePendaftaran[]> {
    return this.pasienService.riwayatRegistrasi({
      where: {
        pasienId: Number(id),
      },
      include: {
        pendaftaran: {
          select: {
            penjamin: true,
            id: true,
            namaAsuransi: true,
            createdAt: true,
            jadwal: {

              include: {
                dokter: {
                  include: {
                    poliklinik: {
                      select: {
                        namaPoli: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });
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
