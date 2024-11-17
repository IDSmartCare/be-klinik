/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CpptService } from './cppt.service';
import { CreateCpptDto } from './dto/create-cppt.dto';
import { SOAP } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('cppt')
export class CpptController {
  constructor(private readonly cpptService: CpptService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createCpptDto: CreateCpptDto) {
    return this.cpptService.create(createCpptDto);
  }

  @UseGuards(AuthGuard)
  @Get('/list/:idpasien/:idfasyankes')
  async findAll(
    @Param('idpasien') idpasien: string,
    @Param('idfasyankes') idfasyankes: string,
  ): Promise<SOAP[]> {
    return this.cpptService.findAll(idfasyankes, idpasien);
  }

  @UseGuards(AuthGuard)
  @Get('/listfarmasi/:idfasyankes')
  async findOne(@Param('idfasyankes') idfasyankes: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.cpptService.listCPPT({
      where: {
        idFasyankes: idfasyankes,
        profesi: 'dokter',
        AND: [{ createdAt: { gte: today } }, { createdAt: { lt: tomorrow } }],
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        pendaftaran: {
          include: {
            episodePendaftaran: {
              select: {
                pasien: {
                  select: {
                    noRm: true,
                    namaPasien: true,
                    jenisKelamin: true,
                    id: true,
                  },
                },
              },
            },
            jadwal: {
              select: {
                doctor: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.cpptService.getOne({
      where: {
        id: Number(id),
      },
    });
  }
}
