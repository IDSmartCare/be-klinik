/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePoliDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import {
  JadwalDokter,
  MasterVoicePoli,
  PoliKlinik,
  Prisma,
  Profile,
} from '@prisma/client';
import { PrismaService } from 'src/service/prisma.service';
import { CreateVoicePoliDto } from './dto/create-voice-polis.dto';
import { s3Client } from 'src/s3.config';
import { ObjectCannedACL, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}
  private readonly bucketName = `${process.env.AWS_BUCKET}`;
  async createPoli(createPoli: CreatePoliDto): Promise<PoliKlinik> {
    return this.prisma.poliKlinik.create({
      data: createPoli,
    });
  }

  async findAllVoicePoli(idFasyankes: string) {
    const voicePolis = await this.prisma.masterVoicePoli.findMany({
      where: {
        OR: [{ idFasyankes: idFasyankes }, { idFasyankes: null }],
      },
    });

    return voicePolis.map((voicePoli) => ({
      id: voicePoli.id,
      namaFile: `${voicePoli.namaPoli.toLowerCase().replace(/\s+/g, '')}.mp3`,
      url: voicePoli.url,
      namaPoli: voicePoli.namaPoli,
      idFasyankes: voicePoli.idFasyankes,
    }));
  }

  async uploadFile(
    file?: Express.Multer.File,
    fileName?: string,
  ): Promise<string> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const fileKey = `voice-poli-idsc/${fileName}`;
    const params = {
      Bucket: this.bucketName,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read' as ObjectCannedACL,
    };

    try {
      await s3Client.send(new PutObjectCommand(params));
      return `${process.env.AWS_URL + '/' + fileKey}`;
    } catch (error) {
      throw new Error(`Error uploading file: ${error}`);
    }
  }
  async createVoicePoli(
    createVoicePoliDto: CreateVoicePoliDto,
  ): Promise<MasterVoicePoli> {
    const namaFasyankes = createVoicePoliDto.namaFasyankes
      .replace(/\s+/g, '')
      .toLowerCase();
    const namaPoli = createVoicePoliDto.namaPoli
      .replace(/\s+/g, '')
      .toLowerCase();
    const fileName = `${namaFasyankes}_${namaPoli}_${randomUUID()}.mp3`;
    const urlFile = await this.uploadFile(createVoicePoliDto.file, fileName);
    return this.prisma.masterVoicePoli.create({
      data: {
        namaPoli: createVoicePoliDto.namaPoli,
        url: urlFile,
        idFasyankes: createVoicePoliDto.idFasyankes,
      },
    });
  }

  async findPoli(params: {
    where: Prisma.PoliKlinikWhereInput;
  }): Promise<PoliKlinik[]> {
    const { where } = params;
    return this.prisma.poliKlinik.findMany({
      where,
    });
  }

  async findJadwalDokter(params: {
    where: Prisma.JadwalDokterWhereInput;
    include: Prisma.JadwalDokterInclude;
  }): Promise<JadwalDokter[]> {
    const { where, include } = params;
    return this.prisma.jadwalDokter.findMany({
      where,
      include,
    });
  }

  async findAllDokter(idFasyankes: string): Promise<Profile[]> {
    try {
      const data = await this.prisma.profile.findMany({
        where: {
          isAktif: true,
          profesi: 'DOKTER',
          idFasyankes,
        },
      });

      if (data.length === 0) {
        throw new Error('No doctors found for this Fasyankes');
      }

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  update(id: number, updateSettingDto: UpdateSettingDto) {
    return `This action updates a #${id} setting`;
  }

  remove(id: number) {
    return `This action removes a #${id} setting`;
  }
}
