import { Injectable } from '@nestjs/common';
import { Prisma, Pasien, EpisodePendaftaran } from '@prisma/client';
import { formatISO } from 'date-fns';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class PasienService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.PasienCreateInput): Promise<Pasien> {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const monthStart = new Date(year, month, 1).getTime()
    const nextMonthStart = new Date(year, month + 1, 1).getTime()

    const transaksi = await this.prisma.$transaction(async (tx) => {
      const count = await tx.pasien.count({
        where: {
          AND: [
            { createdAt: { gte: new Date(monthStart) } }, // Greater than or equal to this month's start
            { createdAt: { lt: new Date(nextMonthStart) } }, // Less than next month's start
          ],
        }
      })
      const totalPasien = `${count + 1}`.toString().padStart(4, "0")
      const totalBulan = month.toString().padStart(2, "0")
      const rm = `${year.toString().slice(-2)}${totalBulan}${totalPasien}`
      const createPasien = await tx.pasien.create({
        data: {
          noRm: rm,
          namaPasien: data.namaPasien.toUpperCase(),
          wargaNegara: data.wargaNegara ?? null,
          nik: data.nik ?? null,
          bpjs: data.bpjs ?? null,
          noAsuransi: data.noAsuransi ?? null,
          paspor: data.paspor ?? null,
          bahasa: data.bahasa ?? null,
          noHp: data.noHp,
          tempatLahir: data.tempatLahir,
          tanggalLahir: formatISO(new Date(data.tanggalLahir)),
          jenisKelamin: data.jenisKelamin,
          statusMenikah: data.statusMenikah,
          agama: data.agama,
          alamat: data.alamat,
          ibuKandung: data.ibuKandung,
          provinsi: data.provinsi,
          idProv: data.idProv,
          kota: data.kota,
          idKota: data.idKota,
          kecamatan: data.kecamatan,
          idKecamatan: data.idKecamatan,
          kelurahan: data.kelurahan,
          idKelurahan: data.idKelurahan,
          rt: data.rt,
          rw: data.rw,
          kodePos: data.kodePos,
          pendidikan: data.pendidikan,
          pekerjaan: data.pekerjaan,
          alamatDomisili: data.alamatDomisili,
          provinsiDomisili: data.provinsiDomisili,
          idProvDomisili: data.idProvDomisili,
          kotaDomisili: data.kotaDomisili,
          idKotaDomisili: data.idKotaDomisili,
          kecamatanDomisili: data.kecamatanDomisili,
          idKecamatanDomisili: data.idKecamatanDomisili,
          kelurahanDomisili: data.kelurahanDomisili,
          idKelurahanDomisili: data.idKelurahanDomisili,
          rtDomisili: data.rtDomisili,
          rwDomisili: data.rwDomisili,
          kodePosDomisili: data.kodePosDomisili,
          idFasyankes: data.idFasyankes,
        }
      })
      return createPasien
    })
    return transaksi
  }

  async riwayatRegistrasi(params: {
    where?: Prisma.EpisodePendaftaranWhereInput;
    include?: Prisma.EpisodePendaftaranInclude
  }): Promise<EpisodePendaftaran[]> {
    const { where, include } = params;
    return this.prisma.episodePendaftaran.findMany({
      where,
      include
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PasienWhereUniqueInput;
    where?: Prisma.PasienWhereInput;
    orderBy?: Prisma.PasienOrderByWithRelationInput;
  }): Promise<Pasien[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.pasien.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(params: { where?: Prisma.PasienWhereInput }): Promise<Pasien> {
    const { where } = params
    return this.prisma.pasien.findFirst({
      where,
    })
  }

  async update(params: {
    where: Prisma.PasienWhereUniqueInput,
    data: Prisma.PasienUpdateInput
  }): Promise<Pasien> {
    const { where, data } = params;
    return this.prisma.pasien.update({
      data,
      where
    })
  }
}
