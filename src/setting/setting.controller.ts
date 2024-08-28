import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreateJadwalDto, CreatePoliDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { JadwalDokter, PoliKlinik } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) { }

  @UseGuards(AuthGuard)
  @Post("/createpoli")
  async create(@Body() createSettingDto: CreatePoliDto): Promise<PoliKlinik> {
    return this.settingService.createPoli(createSettingDto);
  }

  @UseGuards(AuthGuard)
  @Post("/createjadwal")
  async createJadwal(@Body() createSettingDto: CreateJadwalDto): Promise<JadwalDokter> {
    return this.settingService.createJadwal(createSettingDto);
  }

  @UseGuards(AuthGuard)
  @Get("/listpoli/:idfasyankes")
  async findPoli(@Param("idfasyankes") idfasyankes: string): Promise<PoliKlinik[]> {
    return this.settingService.findPoli({
      where: {
        idFasyankes: idfasyankes
      }
    });
  }

  @UseGuards(AuthGuard)
  @Get('/listjadwal/:idfasyankes')
  async findOne(@Param('idfasyankes') idfasyankes: string): Promise<JadwalDokter[]> {
    return this.settingService.findJadwalDokter({
      where: {
        idFasyankes: idfasyankes
      },
      include: {
        dokter: {
          include: {
            poliklinik: {
              select: {
                namaPoli: true,
                kodePoli: true
              }
            }
          }
        }
      }
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingService.update(+id, updateSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.settingService.remove(+id);
  }
}
