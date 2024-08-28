import { Injectable } from '@nestjs/common';
import { CreateJadwalDto, CreatePoliDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JadwalDokter, PoliKlinik, Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) { }


  async createJadwal(createjadwal: CreateJadwalDto): Promise<JadwalDokter> {
    return this.prisma.jadwalDokter.create({
      data: createjadwal
    })
  }

  async createPoli(createPoli: CreatePoliDto): Promise<PoliKlinik> {
    return this.prisma.poliKlinik.create({
      data: createPoli
    })
  }

  async findPoli(params: {
    where: Prisma.PoliKlinikWhereInput
  }): Promise<PoliKlinik[]> {
    const { where } = params
    return this.prisma.poliKlinik.findMany({
      where
    })
  }

  async findJadwalDokter(params: {
    where: Prisma.JadwalDokterWhereInput
    include: Prisma.JadwalDokterInclude
  }): Promise<JadwalDokter[]> {
    const { where, include } = params
    return this.prisma.jadwalDokter.findMany({
      where,
      include
    })
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} setting`;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
