import { Injectable } from '@nestjs/common';
import { CreateResepDto } from './dto/create-resep.dto';
import { UpdateResepDto } from './dto/update-resep.dto';
import { PrismaService } from 'src/service/prisma.service';
import { Prisma, ResepDokter } from '@prisma/client';

@Injectable()
export class ResepService {
  constructor(private prisma: PrismaService) { }


  async create(createResepDto: CreateResepDto[], soapId: string, pendaftaranId: string): Promise<any> {
    const transaksi = await this.prisma.$transaction(async (tx) => {
      const bill = await tx.billPasien.findFirst({
        where: {
          pendaftaranId: Number(pendaftaranId)
        }
      })
      const list: any = createResepDto.map(item => {
        return {
          deskripsi: item?.namaObat,
          subTotal: item?.total?.toString(),
          jenisBill: 'OBAT',
          harga: item.hargaJual,
          jumlah: item.jumlah,
          billPasienId: bill?.id
        }
      })
      const createDetailBill = await tx.billPasienDetail.createMany({
        data: list
      })

      await tx.sOAP.update({
        data: {
          isBillingFarmasi: true
        },
        where: {
          id: Number(soapId)
        }
      })
      return createDetailBill
    })
    return transaksi
  }

  async findAll(params: { where: Prisma.ResepDokterWhereInput, include: Prisma.ResepDokterInclude }): Promise<ResepDokter[]> {
    const { where, include } = params
    return this.prisma.resepDokter.findMany({
      where,
      include
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} resep`;
  }

  update(id: number, updateResepDto: UpdateResepDto) {
    return `This action updates a #${id} resep`;
  }

  remove(id: number) {
    return `This action removes a #${id} resep`;
  }
}
