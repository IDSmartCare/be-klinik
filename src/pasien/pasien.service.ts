/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Injectable } from '@nestjs/common';
import {
  Prisma,
  Pasien,
  EpisodePendaftaran,
  Pendaftaran,
} from '@prisma/client';
import { formatISO } from 'date-fns';
import { PrismaService } from 'src/service/prisma.service';
import { RegisPasienDto } from './dto/regis-pasien.dto';
import { QueueGateway } from 'src/queue/queue.gateway';

@Injectable()
export class PasienService {
  constructor(
    private prisma: PrismaService,
    private queueGateway: QueueGateway,
  ) {}

  private convertDay(num) {
    let dayName;
    switch (num) {
      case 0:
        dayName = 'Minggu';
        break;
      case 1:
        dayName = 'Senin';
        break;
      case 2:
        dayName = 'Selasa';
        break;
      case 3:
        dayName = 'Rabu';
        break;
      case 4:
        dayName = 'Kamis';
        break;
      case 5:
        dayName = 'Jumat';
        break;
      case 6:
        dayName = 'Sabtu';
        break;
      default:
        dayName = 'Invalid Day';
    }
    return dayName;
  }

  async generateQueueNumber(idFasyankes: string): Promise<string> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const countToday = await this.prisma.pendaftaran.count({
      where: {
        idFasyankes: idFasyankes,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
    const nextQueueNumber = countToday + 1;
    const paddedNumber = nextQueueNumber.toString().padStart(4, '0');
    return `P-${paddedNumber}`;
  }

  async queryFindFasyankes(idFasyankes: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.findAllRegistrasi({
      where: {
        isClose: false,
        AND: [{ createdAt: { gte: today } }, { createdAt: { lt: tomorrow } }],
        idFasyankes: idFasyankes,
      },
      orderBy: {
        id: 'desc',
      },
      include: {
        antrian: true,
        doctor: {
          select: {
            name: true,
            unit: true,
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

  async createRegis(
    data: RegisPasienDto,
    userRole?: string,
    userPackage?: string,
  ): Promise<{ registrasi: Pendaftaran; nomorAntrian: string }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (userRole === 'admin' && userPackage === 'FREE' && data.idFasyankes) {
      const existingEpisodes = await this.prisma.episodePendaftaran.count({
        where: {
          pasienId: data.pasienId,
          idFasyankes: data.idFasyankes,
        },
      });

      if (existingEpisodes > 0) {
        throw new Error(
          'Anda hanya diperbolehkan membuat satu episode untuk pasien ini dengan paket FREE.',
        );
      }
    }
    const nomorAntrian = await this.generateQueueNumber(data.idFasyankes);

    const transaksi = await this.prisma.$transaction(async (tx) => {
      let tarifAdm;

      if (data.penjamin === 'BPJS' || data.penjamin === 'PRIBADI') {
        tarifAdm = await tx.masterTarif.findFirst({
          where: {
            idFasyankes: data.idFasyankes,
            penjamin: data.penjamin,
            kategoriTarif: 'Admin',
            isAktif: true,
          },
        });

        if (!tarifAdm) {
          throw new BadRequestException(
            `Silahkan membuat tarif Administrasi untuk ${data.penjamin}`,
          );
        }
      } else if (data.penjamin?.startsWith('ASURANSI')) {
        tarifAdm = await tx.masterTarif.findFirst({
          where: {
            idFasyankes: data.idFasyankes,
            penjamin: data.penjamin,
            kategoriTarif: 'Admin',
            isAktif: true,
          },
        });

        if (!tarifAdm) {
          tarifAdm = await tx.masterTarif.findFirst({
            where: {
              idFasyankes: data.idFasyankes,
              penjamin: 'PRIBADI',
              kategoriTarif: 'Admin',
              isAktif: true,
            },
          });
        }

        if (!tarifAdm) {
          throw new BadRequestException(
            `Silahkan membuat tarif Administrasi untuk ${data.penjamin} atau PRIBADI`,
          );
        }
      } else {
        throw new BadRequestException(
          `Jenis penjamin ${data.penjamin} tidak valid`,
        );
      }

      const lastEpisode = await tx.episodePendaftaran.findMany({
        where: {
          pasienId: data.pasienId,
          idFasyankes: data.idFasyankes,
        },
        orderBy: {
          id: 'desc',
        },
        take: 1,
      });

      if (lastEpisode.length === 0) {
        const episodeBaru = await tx.episodePendaftaran.create({
          data: {
            pasienId: data.pasienId,
            episode: 1,
            idFasyankes: data.idFasyankes,
          },
        });

        const registrasi = await tx.pendaftaran.create({
          data: {
            episodePendaftaranId: episodeBaru.id,
            doctorId: data.doctorId,
            penjamin: data.penjamin,
            namaAsuransi: data.namaAsuransi,
            nomorAsuransi: data.nomorAsuransi,
            idFasyankes: data.idFasyankes,
          },
          include: {
            doctor: true,
          },
        });

        await tx.antrianPasien.create({
          data: {
            nomor: nomorAntrian,
            tanggal: new Date(),
            doctorId: data.doctorId,
            jumlahPanggil: 0,
            idFasyankes: data.idFasyankes,
            pendaftaranId: registrasi.id,
          },
        });

        const riwayatPendaftaran = await tx.riwayatPendaftaran.create({
          data: {
            pendaftaranId: registrasi.id,
            doctorId: data.doctorId,
            availableTimeId: data.availableTimeId,
            idFasyankes: data.idFasyankes,
            hari: this.convertDay(data.hari) as string,
          },
        });

        const bill = await tx.billPasien.create({
          data: {
            pendaftaranId: registrasi.id,
          },
        });
        await tx.billPasienDetail.create({
          data: {
            harga: tarifAdm?.hargaTarif,
            jenisBill: 'Admin',
            deskripsi: tarifAdm?.namaTarif,
            billPasienId: bill.id,
            jumlah: 1,
            subTotal: (Number(tarifAdm?.hargaTarif) * 1).toString(),
          },
        });
        this.queueGateway;
        return { registrasi, nomorAntrian };
      } else {
        const count = await tx.pendaftaran.count({
          where: {
            AND: [
              { createdAt: { gte: today } },
              { createdAt: { lt: tomorrow } },
            ],
            episodePendaftaranId: lastEpisode[0].id,
            idFasyankes: data.idFasyankes,
          },
        });
        if (count > 0) {
          const registrasi = await tx.pendaftaran.create({
            data: {
              episodePendaftaranId: lastEpisode[0].id,
              doctorId: data.doctorId,
              penjamin: data.penjamin,
              namaAsuransi: data.namaAsuransi,
              nomorAsuransi: data.nomorAsuransi,
              idFasyankes: data.idFasyankes,
            },
            include: {
              doctor: true,
            },
          });
          await tx.antrianPasien.create({
            data: {
              nomor: nomorAntrian,
              tanggal: new Date(),
              doctorId: data.doctorId,
              jumlahPanggil: 0,
              idFasyankes: data.idFasyankes,
              pendaftaranId: registrasi.id,
            },
          });

          const riwayatPendaftaran = await tx.riwayatPendaftaran.create({
            data: {
              pendaftaranId: registrasi.id,
              doctorId: data.doctorId,
              availableTimeId: data.availableTimeId,
              idFasyankes: data.idFasyankes,
              hari: this.convertDay(data.hari) as string,
            },
          });
          const bill = await tx.billPasien.create({
            data: {
              pendaftaranId: registrasi.id,
            },
          });

          await tx.billPasienDetail.create({
            data: {
              harga: tarifAdm?.hargaTarif,
              jenisBill: 'Admin',
              deskripsi: tarifAdm?.namaTarif,
              billPasienId: bill.id,
              jumlah: 1,
              subTotal: (Number(tarifAdm?.hargaTarif) * 1).toString(),
            },
          });
          return { registrasi, nomorAntrian };
        } else {
          const episodeBaru = await tx.episodePendaftaran.create({
            data: {
              pasienId: data.pasienId,
              episode: lastEpisode[0].episode + 1,
              idFasyankes: data.idFasyankes,
            },
          });

          const registrasi = await tx.pendaftaran.create({
            data: {
              episodePendaftaranId: episodeBaru.id,
              doctorId: data.doctorId,
              penjamin: data.penjamin,
              namaAsuransi: data.namaAsuransi,
              nomorAsuransi: data.nomorAsuransi,
              idFasyankes: data.idFasyankes,
            },
            include: {
              doctor: true,
            },
          });
          await tx.antrianPasien.create({
            data: {
              nomor: nomorAntrian,
              tanggal: new Date(),
              jumlahPanggil: 0,
              doctorId: data.doctorId,
              idFasyankes: data.idFasyankes,
              pendaftaranId: registrasi.id,
            },
          });

          const riwayatPendaftaran = await tx.riwayatPendaftaran.create({
            data: {
              pendaftaranId: registrasi.id,
              doctorId: data.doctorId,
              availableTimeId: data.availableTimeId,
              idFasyankes: data.idFasyankes,
              hari: this.convertDay(data.hari) as string,
            },
          });
          const bill = await tx.billPasien.create({
            data: {
              pendaftaranId: registrasi.id,
            },
          });
          await tx.billPasienDetail.create({
            data: {
              harga: tarifAdm?.hargaTarif,
              jenisBill: 'Admin',
              deskripsi: tarifAdm?.namaTarif,
              billPasienId: bill.id,
              jumlah: 1,
              subTotal: (Number(tarifAdm?.hargaTarif) * 1).toString(),
            },
          });
          return { registrasi, nomorAntrian };
        }
      }
    });

    await this.queryFindFasyankes(data.idFasyankes);
    return transaksi;
  }

  async create(
    data: Prisma.PasienCreateInput,
    userRole?: string,
    userPackage?: string,
  ): Promise<Pasien> {
    if (userRole === 'admin' && userPackage === 'FREE' && data.idFasyankes) {
      const patientCount = await this.prisma.pasien.count({
        where: {
          idFasyankes: data.idFasyankes,
        },
      });

      if (patientCount >= 10) {
        throw new Error(
          'Anda telah mencapai batas 10 pasien untuk paket FREE.',
        );
      }
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const monthStart = new Date(year, month, 1).getTime();
    const nextMonthStart = new Date(year, month + 1, 1).getTime();

    const transaksi = await this.prisma.$transaction(async (tx) => {
      const count = await tx.pasien.count({
        where: {
          AND: [
            { createdAt: { gte: new Date(monthStart) } },
            { createdAt: { lt: new Date(nextMonthStart) } },
          ],
        },
      });
      const totalPasien = `${count + 1}`.toString().padStart(4, '0');
      const totalBulan = month.toString().padStart(2, '0');
      const rm = `${year.toString().slice(-2)}${totalBulan}${totalPasien}`;
      return tx.pasien.create({
        data: {
          noRm: rm,
          namaPasien: data.namaPasien.toUpperCase(),
          wargaNegara: data.wargaNegara ?? null,
          nik: data.nik ?? null,
          bpjs: data.bpjs ?? null,
          noAsuransi: data.noAsuransi ?? null,
          paspor: data.paspor ?? null,
          bahasa: data.bahasa ?? null,
          email: data.email,
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
        },
      });
    });

    return transaksi;
  }

  async riwayatRegistrasi(params: {
    where?: Prisma.EpisodePendaftaranWhereInput;
    include?: Prisma.EpisodePendaftaranInclude;
    orderBy?: Prisma.EpisodePendaftaranOrderByWithRelationInput;
  }): Promise<EpisodePendaftaran[]> {
    const { where, include, orderBy } = params;
    return this.prisma.episodePendaftaran.findMany({
      where,
      include,
      orderBy,
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

  async findAllRegistrasi(params: {
    where?: Prisma.PendaftaranWhereInput;
    orderBy?: Prisma.PendaftaranOrderByWithRelationInput;
    include?: Prisma.PendaftaranInclude;
  }): Promise<Pendaftaran[]> {
    const { where, orderBy, include } = params;

    const data = await this.prisma.pendaftaran.findMany({
      where,
      orderBy,
      include,
    });
    await this.queueGateway.emitDataAntrianPasien(data);
    return data;
  }

  async findOne(params: { where?: Prisma.PasienWhereInput }): Promise<Pasien> {
    const { where } = params;
    return this.prisma.pasien.findFirst({
      where,
    });
  }

  async update(params: {
    where: Prisma.PasienWhereUniqueInput;
    data: Prisma.PasienUpdateInput;
  }): Promise<Pasien> {
    const { where, data } = params;
    return this.prisma.pasien.update({
      data,
      where,
    });
  }

  async checkPasien(rm?: string, nik?: string): Promise<any> {
    if (!rm && !nik) {
      return {
        success: false,
        message:
          'Harap masukkan Nomor Rekam Medis atau Nomor Induk Kependudukan.',
      };
    }

    const pasien = await this.prisma.pasien.findFirst({
      where: rm ? { noRm: rm } : { nik: nik },
    });

    if (!pasien) {
      return {
        success: false,
        message: `${rm ? 'Nomor Rekam Medis' : 'Nomor Induk Kependudukan'} tidak ditemukan.`,
      };
    }

    return {
      success: true,
      message: `${rm ? 'Nomor Rekam Medis' : 'Nomor Induk Kependudukan'} ditemukan.`,
      data: pasien,
    };
  }
}
