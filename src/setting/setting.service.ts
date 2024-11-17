/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJadwalDto, CreatePoliDto } from './dto/create-setting.dto';
import { UpdateJadwalDto, UpdateSettingDto } from './dto/update-setting.dto';
import { JadwalDokter, PoliKlinik, Prisma, Profile } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { format, isWithinInterval } from 'date-fns';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  // async createJadwal(createjadwal: CreateJadwalDto): Promise<any> {
  //   const getDate = await this.prisma.jadwalDokter.findFirst({
  //     where: {
  //       dokterId: createjadwal.dokterId,
  //       hari: createjadwal.hari,
  //       idFasyankes: createjadwal.idFasyankes,
  //     },
  //     orderBy: { id: 'desc' },
  //   });
  //   if (getDate) {
  //     const splitJam = getDate.jamPraktek.split('-');
  //     const startJam = splitJam[0];
  //     const endJam = splitJam[1];

  //     const inputJam = createjadwal.jamPraktek.split('-');
  //     const startInputjam = inputJam[0];

  //     const dateNow = format(new Date(), 'yyyy-MM-dd');

  //     const start = new Date(`${dateNow} ${startJam}`);
  //     const end = new Date(`${dateNow} ${endJam}`);
  //     const input = new Date(`${dateNow} ${startInputjam}`);

  //     const resInterval = isWithinInterval(input, { start, end });
  //     if (resInterval) {
  //       throw new HttpException(
  //         'Jadwal dokter sudah ada!',
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     } else {
  //       return this.prisma.jadwalDokter.create({
  //         data: createjadwal,
  //       });
  //     }
  //   } else {
  //     return this.prisma.jadwalDokter.create({
  //       data: createjadwal,
  //     });
  //   }
  // }

  // async updateJadwal(
  //   id: number,
  //   updateJadwalDto: UpdateJadwalDto,
  // ): Promise<any> {
  //   const existingJadwal = await this.prisma.jadwalDokter.findUnique({
  //     where: {
  //       id: Number(id),
  //     },
  //   });

  //   if (!existingJadwal) {
  //     throw new HttpException(
  //       { message: 'Jadwal tidak ditemukan!', status: 'error' },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }

  //   const conflictingJadwal = await this.prisma.jadwalDokter.findFirst({
  //     where: {
  //       dokterId: existingJadwal.dokterId,
  //       hari: updateJadwalDto.hari,
  //       jamPraktek: updateJadwalDto.jamPraktek,
  //       idFasyankes: updateJadwalDto.idFasyankes,
  //       id: { not: Number(id) },
  //     },
  //   });

  //   if (conflictingJadwal) {
  //     throw new HttpException(
  //       {
  //         message: 'Jadwal dokter sudah ada pada waktu tersebut!',
  //         status: 'error',
  //       },
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }

  //   const updatedJadwal = await this.prisma.jadwalDokter.update({
  //     where: { id: Number(id) },
  //     data: {
  //       hari: updateJadwalDto.hari,
  //       jamPraktek: updateJadwalDto.jamPraktek,
  //     },
  //   });

  //   return {
  //     status: 'success',
  //     message: 'Jadwal updated successfully',
  //     data: updatedJadwal,
  //   };
  // }

  // async createPoli(createPoli: CreatePoliDto): Promise<PoliKlinik> {
  //   return this.prisma.poliKlinik.create({
  //     data: createPoli,
  //   });
  // }

  // async findPoli(params: {
  //   where: Prisma.PoliKlinikWhereInput;
  // }): Promise<PoliKlinik[]> {
  //   const { where } = params;
  //   return this.prisma.poliKlinik.findMany({
  //     where,
  //   });
  // }

  // async findJadwalDokter(params: {
  //   where: Prisma.JadwalDokterWhereInput;
  //   include: Prisma.JadwalDokterInclude;
  // }): Promise<JadwalDokter[]> {
  //   const { where, include } = params;
  //   return this.prisma.jadwalDokter.findMany({
  //     where,
  //     include,
  //   });
  // }

  // async findAllDokter(idFasyankes: string): Promise<Profile[]> {
  //   try {
  //     const data = await this.prisma.profile.findMany({
  //       where: {
  //         isAktif: true,
  //         profesi: 'DOKTER',
  //         idFasyankes,
  //       },
  //     });

  //     if (data.length === 0) {
  //       throw new Error('No doctors found for this Fasyankes');
  //     }

  //     return data;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  // update(id: number, updateSettingDto: UpdateSettingDto) {
  //   return `This action updates a #${id} setting`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} setting`;
  // }
}
