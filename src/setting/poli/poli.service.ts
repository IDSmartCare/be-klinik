import { Injectable } from '@nestjs/common';
import { PoliKlinik, Prisma } from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class PoliService {
    constructor(private prisma: PrismaService) {}


    async updatePoliStatus(id: number, isAktif: boolean): Promise<PoliKlinik> {
        const idPoli = Number(id);
        return this.prisma.poliKlinik.update({
            where: {
                id: idPoli,
            },
            data: {
                isAktif: isAktif,
            }
        })
    }


    async deletePoli(
        where: Prisma.PoliKlinikWhereUniqueInput,
    ): Promise<{ message: string; data?: PoliKlinik}> {
        try {
            const deletePoli = await this.prisma.poliKlinik.delete({
                where,
            });

            return {
                message: 'Data poli klinik berhasil di hapus',
                data: deletePoli,
            };
        } catch (error) {
            return {
                message: `Gagal menghapus data poli klinik Error: ${error.message}`,
            }
        }
    }
}
