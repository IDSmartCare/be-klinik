import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';
import { CreateAntrianAdmisiDto } from './dto/create-admisi.dto';

@Injectable()
export class AntrianService {
  constructor(private prisma: PrismaService) {}

  async storeAntrianAdmisi(dto: CreateAntrianAdmisiDto) {
    const { tanggal, status, jumlahPanggil, idFasyankes } = dto;
  
    try {
      // Ambil tanggal hari ini dan besok
      const today = new Date();
      today.setHours(0, 0, 0, 0); 
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); 
  
      // Hitung jumlah antrian untuk hari ini
      const countToday = await this.prisma.antrianAdmisi.count({
        where: {
          tanggal: {
            gte: today,      // Lebih besar atau sama dengan hari ini
            lt: tomorrow,    // Lebih kecil dari besok
          },
        },
      });
  
      // Menambahkan jumlah antrian yang ada hari ini ke jumlahPanggil
      const updatedJumlahPanggil = jumlahPanggil + countToday;
  
      
      const lastAntrian = await this.prisma.antrianAdmisi.findFirst({
        orderBy: {
          nomor: 'desc', 
        },
        where: {
          tanggal: {
            gte: today,  
            lt: tomorrow,
          },
        },
      });
  
      let nomorBaru = 'A-0001'; 
      if (lastAntrian) {
        const lastNomor = lastAntrian.nomor;
        const lastNumber = parseInt(lastNomor.split('-')[1]); 
        const newNumber = lastNumber + 1; 
        nomorBaru = `A-${newNumber.toString().padStart(4, '0')}`;  
      }
  
      // Menyusun data untuk disimpan
      const newAntrian = {
        nomor: nomorBaru,
        tanggal,
        status,
        jumlahPanggil: updatedJumlahPanggil,
        idFasyankes,
      };
  
      // Simpan data ke database
      const antrian = await this.prisma.antrianAdmisi.create({
        data: newAntrian,
      });
  
      
      return {
        status: 'success',
        message: 'Antrian berhasil disimpan',
        data: antrian,
      };
    } catch (error) {
      
      return {
        status: 'error',
        message: 'Terjadi kesalahan saat menyimpan antrian',
        error: error.message,
      };
    }
  }
  
}
