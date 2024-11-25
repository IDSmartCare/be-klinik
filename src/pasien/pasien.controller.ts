/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PasienService } from './pasien.service';
import { EpisodePendaftaran, Pasien, Pendaftaran } from '@prisma/client';
import { UpdatePasienDto } from './dto/update-pasien.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { RegisPasienDto } from './dto/regis-pasien.dto';
import { CheckPasienDto } from './dto/check-pasien.dto';

@Controller('pasien')
export class PasienController {
  constructor(private readonly pasienService: PasienService) {}

  @UseGuards(AuthGuard)
  @Get('/listdokter/:iddokter/:idfasyankes')
  async findListPasienDokter(
    @Param('iddokter') iddokter: string,
    @Param('idfasyankes') idfasyankes: string,
  ): Promise<Pendaftaran[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.pasienService.findAllRegistrasi({
      where: {
        isClose: false,
        idFasyankes: idfasyankes,
        AND: [{ createdAt: { gte: today } }, { createdAt: { lt: tomorrow } }],
        riwayat: {
          doctorId: Number(iddokter),
        },
        isSoapPerawat: true,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        riwayat: {
          select: {
            doctor: {
              select: {
                availableDays: true,
                availableTimes: true,
              },
            },
          },
        },
        episodePendaftaran: {
          select: {
            pasien: {
              select: {
                noRm: true,
                namaPasien: true,
                jenisKelamin: true,
                kelurahan: true,
                id: true,
              },
            },
          },
        },
      },
    });
  }

  @UseGuards(AuthGuard)
  @Get('/listregistrasi/:idfasyankes')
  async findAllRegistrasi(
    @Param('idfasyankes') idfasyankes: string,
  ): Promise<Pendaftaran[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.pasienService.findAllRegistrasi({
      where: {
        isClose: false,
        AND: [{ createdAt: { gte: today } }, { createdAt: { lt: tomorrow } }],
        idFasyankes: idfasyankes,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        antrian: true,
        doctor: {
          select: {
            name: true,
            availableDays: true,
            availableTimes: true,
          },
        },
        episodePendaftaran: {
          include: {
            pasien: {
              select: {
                noRm: true,
                namaPasien: true,
                jenisKelamin: true,
                kelurahan: true,
                id: true,
                paspor: true,
              },
            },
          },
        },
      },
    });
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body()
    data: {
      pasienData: any;
      userRole: string;
      userPackage: string;
    },
  ): Promise<Pasien> {
    try {
      return await this.pasienService.create(
        data.pasienData,
        data.userRole,
        data.userPackage,
      );
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Failed to create pasien');
    }
  }

  @UseGuards(AuthGuard)
  @Post('/registrasi')
  async createRegis(
    @Body()
    data: {
      pasienData: RegisPasienDto;
      userRole: string;
      userPackage: string;
    },
  ): Promise<Pendaftaran> {
    try {
      return await this.pasienService.createRegis(
        data.pasienData,
        data.userRole,
        data.userPackage,
      );
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.message || 'Failed to create pasien');
    }
  }

  @UseGuards(AuthGuard)
  @Get(':idfasyankes')
  async findAll(@Param('idfasyankes') idfasyankes: string): Promise<Pasien[]> {
    return this.pasienService.findAll({
      where: {
        idFasyankes: idfasyankes,
      },
      orderBy: {
        id: 'desc',
      },
      take: 150,
    });
  }

  @UseGuards(AuthGuard)
  @Get('/byid/:id')
  async findOne(@Param('id') id: string): Promise<Pasien> {
    return this.pasienService.findOne({
      where: {
        id: Number(id),
      },
    });
  }

  @UseGuards(AuthGuard)
  @Get('/riwayatregistrasi/byfaskes/:idfasyankes')
  async riwayatRegisByIdfaskes(
    @Param('idfasyankes') idfasyankes: string,
  ): Promise<EpisodePendaftaran[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.pasienService.riwayatRegistrasi({
      where: {
        AND: [{ createdAt: { gte: today } }, { createdAt: { lt: tomorrow } }],
        idFasyankes: idfasyankes,
      },
      include: {
        pasien: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  @UseGuards(AuthGuard)
  @Get('/riwayatregistrasi/byepisode/:idepisode/:idfasyankes')
  async riwayatRegisByEpisode(
    @Param('idepisode') idepisode: string,
    @Param('idfasyankes') idfasyankes: string,
  ): Promise<Pendaftaran[]> {
    return this.pasienService.findAllRegistrasi({
      where: {
        episodePendaftaranId: Number(idepisode),
        idFasyankes: idfasyankes,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        billPasien: true,
        riwayat: {
          include: {
            doctor: {
              include: {
                poliKlinik: {
                  select: {
                    namaPoli: true,
                    kodePoli: true,
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
            nomorAsuransi: true,
            createdAt: true,
            riwayat: {
              include: {
                availableTime: true,
                doctor: {
                  include: {
                    poliKlinik: true,
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
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePasienDto: UpdatePasienDto,
  ): Promise<Pasien> {
    return this.pasienService.update({
      where: {
        id: Number(id),
      },
      data: updatePasienDto,
    });
  }

  @UseGuards(AuthGuard)
  @Post('/apm/check')
  async checkPasien(@Body() checkPasienDto: CheckPasienDto) {
    const { rm, nik } = checkPasienDto;
    return this.pasienService.checkPasien(rm, nik);
  }
}
