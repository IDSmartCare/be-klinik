import { Injectable } from '@nestjs/common';
import { CreateCpptDto } from './dto/create-cppt.dto';
import { PrismaService } from 'src/service/prisma.service';
import { Prisma, SOAP } from '@prisma/client';
import { CreateAntrianAdmisiDto } from 'src/antrian/dto/create-admisi.dto';

@Injectable()
export class CpptService {
  constructor(private prisma: PrismaService) {}

  async getMasterSoap(kategori: string, idFasyankes: string): Promise<any> {
    if (kategori === 'subjective') {
      const subjectiveSoap = await this.prisma.masterSubjective.findMany({
        where: {
          idFasyankes,
        },
        include: {
          keyword: true,
        },
      });
      return { sucess: true, data: subjectiveSoap };
    }
    if (kategori === 'objective') {
      const objectiveSoap = await this.prisma.masterObjective.findMany({
        where: {
          idFasyankes,
        },
        include: {
          keyword: true,
        },
      });
      return { sucess: true, data: objectiveSoap };
    }
    if (kategori === 'plan') {
      const planSoap = await this.prisma.masterPlan.findMany({
        where: {
          idFasyankes,
        },
        include: {
          keyword: true,
        },
      });
      return { sucess: true, data: planSoap };
    }
    if (kategori === 'assessment') {
      const assessmentSoap = await this.prisma.masterAssessment.findMany({
        where: {
          idFasyankes,
        },
        include: {
          keyword: true,
        },
      });
      return { sucess: true, data: assessmentSoap };
    }
    if (kategori === 'instruction') {
      const instructionSoap = await this.prisma.masterInstruction.findMany({
        where: {
          idFasyankes,
        },
        include: {
          keyword: true,
        },
      });
      return { sucess: true, data: instructionSoap };
    }
  }
  async create(createCpptDto: CreateCpptDto): Promise<any> {
    const listResep = createCpptDto.resep;

    const transaksi = await this.prisma.$transaction(async (tx) => {
      const simpanSoap = await tx.sOAP.create({
        data: {
          pendaftaranId: createCpptDto.pendaftaranId,
          profesi: createCpptDto.profesi,
          profileId: createCpptDto.profileId,
          isDokter: createCpptDto.isDokter,
          isVerifDokter: createCpptDto.isVerifDokter,
          jamVerifDokter: createCpptDto.jamVerifDokter,
          kodeDiagnosa: createCpptDto.kodeDiagnosa,
          namaDiagnosa: createCpptDto.namaDiagnosa,
          idFasyankes: createCpptDto.idFasyankes,
        },
      });

      const simpanDetailSoap = await tx.detailSOAP.create({
        data: {
          subjective: createCpptDto.subjective,
          objective: createCpptDto.objective,
          assessment: createCpptDto.assessment,
          plan: createCpptDto.plan,
          instruction: createCpptDto.instruction,
          soapId: simpanSoap.id,
        },
      });

      if (listResep.length > 0) {
        const resepDokter = listResep.map((item) => {
          return {
            sOAPId: simpanSoap.id,
            namaObat: item.namaObat,
            obatId: item.obatId,
            jumlah: Number(item.jumlah),
            signa1: item.signa1,
            signa2: item.signa2,
            aturanPakai: item.aturanPakai,
            waktu: item.waktu,
            catatan: item?.catatan,
            satuan: item?.satuan,
            hargaJual: item?.harga_jual,
            stok: item?.stok,
          };
        });
        await tx.resepDokter.createMany({
          data: resepDokter,
        });
      }

      if (createCpptDto.profesi === 'dokter') {
        await tx.pendaftaran.update({
          where: {
            id: Number(createCpptDto.pendaftaranId),
          },
          data: {
            isSoapDokter: true,
          },
        });

        const getPenjamin = await tx.pendaftaran.findFirst({
          where: {
            id: Number(createCpptDto.pendaftaranId),
          },
        });

        const konsulDokter = await tx.masterTarif.findFirst({
          where: {
            idFasyankes: createCpptDto.idFasyankes,
            penjamin: getPenjamin?.penjamin,
            kategoriTarif: 'Dokter',
            isAktif: true,
          },
        });

        const bill = await tx.billPasien.findFirst({
          where: {
            pendaftaranId: createCpptDto.pendaftaranId,
          },
        });

        await tx.billPasienDetail.create({
          data: {
            harga: konsulDokter?.hargaTarif,
            jenisBill: 'Dokter',
            deskripsi: konsulDokter?.namaTarif ?? '',
            billPasienId: bill?.id,
            jumlah: 1,
            subTotal: (Number(konsulDokter?.hargaTarif) * 1).toString(),
          },
        });
      } else {
        await tx.pendaftaran.update({
          where: {
            id: Number(createCpptDto.pendaftaranId),
          },
          data: {
            isSoapPerawat: true,
          },
        });
      }
      return simpanSoap;
    });
    return transaksi;
  }

  async findAll(idFasyankes: string, id: string): Promise<SOAP[]> {
    const transaksi = await this.prisma.$transaction(async (tx) => {
      const totalRows = await tx.sOAP.count({
        where: {
          idFasyankes,
          pendaftaran: {
            episodePendaftaran: {
              pasienId: Number(id),
            },
          },
        },
      });
      const rowsToSkip = totalRows > 10 ? totalRows - 10 : 0;
      const getDb = await tx.sOAP.findMany({
        take: 10,
        skip: rowsToSkip,
        orderBy: {
          id: 'asc',
        },
        include: {
          inputBy: {
            select: {
              id: true,
              namaLengkap: true,
            },
          },
          resep: true,
          detailSOAP: true,
        },
        where: {
          idFasyankes,
          pendaftaran: {
            episodePendaftaran: {
              pasienId: Number(id),
            },
          },
        },
      });
      return getDb;
    });
    return transaksi;
  }

  async listCPPT(params: {
    where: Prisma.SOAPWhereInput;
    include: Prisma.SOAPInclude;
    orderBy?: Prisma.SOAPOrderByWithRelationInput;
  }): Promise<SOAP[]> {
    const { where, orderBy, include } = params;
    return this.prisma.sOAP.findMany({
      where,
      orderBy,
      include,
    });
  }

  async getOne(params: { where: Prisma.SOAPWhereInput }): Promise<SOAP> {
    const { where } = params;
    return this.prisma.sOAP.findFirst({
      where,
    });
  }
}
