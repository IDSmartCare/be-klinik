import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJadwalDto, CreatePoliDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JadwalDokter, PoliKlinik, Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { format, isWithinInterval } from 'date-fns';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) { }

  async createJadwal(createjadwal: CreateJadwalDto): Promise<any> {
    const getDate = await this.prisma.jadwalDokter.findFirst({
      where: {
        dokterId: createjadwal.dokterId,
        hari: createjadwal.hari,
        idFasyankes: createjadwal.idFasyankes
      },
      orderBy: { id: 'desc' }
    })
    if (getDate) {
      const splitJam = getDate.jamPraktek.split("-")
      const startJam = splitJam[0]
      const endJam = splitJam[1]

      const inputJam = createjadwal.jamPraktek.split("-")
      const startInputjam = inputJam[0]

      const dateNow = format(new Date(), 'yyyy-MM-dd')

      const start = new Date(`${dateNow} ${startJam}`);
      const end = new Date(`${dateNow} ${endJam}`);
      const input = new Date(`${dateNow} ${startInputjam}`);

      const resInterval = isWithinInterval(input, { start, end });
      if (resInterval) {
        throw new HttpException('Jadwal dokter sudah ada!', HttpStatus.BAD_REQUEST);
      } else {
        return this.prisma.jadwalDokter.create({
          data: createjadwal
        })
      }
    } else {
      return this.prisma.jadwalDokter.create({
        data: createjadwal
      })
    }
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
