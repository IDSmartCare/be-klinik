/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ResepService } from './resep.service';
import { CreateResepDto } from './dto/create-resep.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('resep')
export class ResepController {
  constructor(private readonly resepService: ResepService) { }

  @UseGuards(AuthGuard)
  @Post("/transaksi/:idsoap/:idpendaftaran")
  async create(
    @Body() createResepDto: CreateResepDto[],
    @Param("idsoap") idsoap: string,
    @Param("idpendaftaran") idpendaftaran: string) {
    return this.resepService.create(createResepDto, idsoap, idpendaftaran);
  }

  @UseGuards(AuthGuard)
  @Get("/bysoap/:id")
  async findAll(@Param("id") id: string) {
    return this.resepService.findAll({
      where: {
        sOAPId: Number(id)
      },
      include: {
        SOAP: {
          include: {
            pendaftaran: {
              select: {
                id: true
              }
            }
          }
        }
      }
    });
  }

}
