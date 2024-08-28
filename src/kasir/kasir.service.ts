import { Injectable } from '@nestjs/common';
import { CreateKasirDto } from './dto/create-kasir.dto';
import { PrismaService } from 'src/service/prisma.service';
import { BillPasien, PembayaranPasien, Prisma } from '@prisma/client';

@Injectable()
export class KasirService {
  constructor(private prisma: PrismaService) { }

  async createPembayaran(createKasirDto: CreateKasirDto): Promise<PembayaranPasien> {
    const transaksi = await this.prisma.$transaction(async (tx) => {
      const payment = await tx.pembayaranPasien.create({
        data: {
          billPasienId: createKasirDto.id,
          tglBayar: createKasirDto.tglBayar,
          totalBayar: createKasirDto.bayar.toString(),
          totalDiskon: createKasirDto.totalDiskon.toString(),
          totalPajak: createKasirDto.totalPajak.toString(),
          kembalian: createKasirDto.kembali.toString()
        }
      })
      await tx.billPasien.update({
        where: {
          id: createKasirDto.id
        },
        data: {
          totalBill: createKasirDto.total.toString(),
          status: "LUNAS"
        }
      })
      await tx.pendaftaran.update({
        where: {
          id: createKasirDto.id
        },
        data: {
          isClose: true
        }
      })
      return payment
    })
    return transaksi
  }

  async findOneByPendaftaranId(params: {
    where?: Prisma.BillPasienWhereInput,
    include?: Prisma.BillPasienInclude
  }): Promise<BillPasien> {
    const { where, include } = params
    return this.prisma.billPasien.findFirst({
      where,
      include
    });
  }
}
