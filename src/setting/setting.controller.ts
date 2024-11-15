/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateJadwalDto, CreatePoliDto } from './dto/create-setting.dto';
import { UpdateJadwalDto, UpdateSettingDto } from './dto/update-setting.dto';
import { JadwalDokter, PoliKlinik } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @UseGuards(AuthGuard)
  @Post('/createpoli')
  async create(@Body() createSettingDto: CreatePoliDto): Promise<PoliKlinik> {
    return this.settingService.createPoli(createSettingDto);
  }

  @UseGuards(AuthGuard)
  @Post('/createjadwal')
  async createJadwal(
    @Body() createSettingDto: CreateJadwalDto,
  ): Promise<JadwalDokter> {
    return this.settingService.createJadwal(createSettingDto);
  }

  @UseGuards(AuthGuard)
  @Put('/editjadwal/:id')
  async updateJadwal(
    @Param('id') id: number,
    @Body() updateJadwalDto: UpdateJadwalDto,
  ) {
    try {
      // Call the updateJadwal service method
      const result = await this.settingService.updateJadwal(
        id,
        updateJadwalDto,
      );

      return {
        status: result.status,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      throw new HttpException(
        { message: error.message || 'Internal server error', status: 'error' },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('/listpoli/:idfasyankes')
  async findPoli(
    @Param('idfasyankes') idfasyankes: string,
  ): Promise<PoliKlinik[]> {
    return this.settingService.findPoli({
      where: {
        idFasyankes: idfasyankes,
      },
    });
  }

  @UseGuards(AuthGuard)
  @Get('/listjadwal/:idfasyankes')
  async findOne(
    @Param('idfasyankes') idfasyankes: string,
  ): Promise<JadwalDokter[]> {
    return this.settingService.findJadwalDokter({
      where: {
        idFasyankes: idfasyankes,
      },
      include: {
        dokter: {
          include: {
            poliklinik: {
              select: {
                namaPoli: true,
                kodePoli: true,
              },
            },
          },
        },
      },
    });
  }

  // @UseGuards(AuthGuard)
  // @Get('/listdokter/:idFasyankes')
  // async findAllDokter(@Param('idFasyankes') idFasyankes: string) {
  //   try {
  //     const data = await this.settingService.findAllDokter(idFasyankes);
  //     return { success: true, data };
  //   } catch (error) {
  //     // Cek apakah error merupakan error yang tidak ditemukan atau error lainnya
  //     throw new HttpException(
  //       {
  //         success: false,
  //         message: error.message,
  //       },
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.update(+id, updateSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingService.remove(+id);
  }
}
