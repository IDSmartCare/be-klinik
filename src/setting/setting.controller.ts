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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import { CreatePoliDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { MasterVoicePoli, PoliKlinik } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateVoicePoliDto } from './dto/create-voice-polis.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateVoicePolisDto } from './dto/update-voice-polis.dto';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @UseGuards(AuthGuard)
  @Post('/createpoli')
  async create(@Body() createSettingDto: CreatePoliDto): Promise<PoliKlinik> {
    return this.settingService.createPoli(createSettingDto);
  }

  @UseGuards(AuthGuard)
  @Get('/voicepoli/:idFasyankes')
  async findAllVoicePoli(@Param('idFasyankes') idFasyankes: string) {
    return this.settingService.findAllVoicePoli(idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Post('/createvoicepoli')
  @UseInterceptors(FileInterceptor('file'))
  async createVoicePoli(
    @UploadedFile() file: Express.Multer.File,
    @Body() createVoicePoliDto: CreateVoicePoliDto,
  ): Promise<MasterVoicePoli> {
    createVoicePoliDto.file = file;
    return this.settingService.createVoicePoli(createVoicePoliDto);
  }
  @UseGuards(AuthGuard)
  @Patch('/updatevoicepoli/:id')
  @UseInterceptors(FileInterceptor('file'))
  async updateVoicePoli(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateVoicePolisDto: UpdateVoicePolisDto,
  ) {
    updateVoicePolisDto.file = file;
    return this.settingService.updateVoicePoli(+id, updateVoicePolisDto);
  }
  @UseGuards(AuthGuard)
  @Get('/detailvoice/:id/:idFasyankes')
  async detailVoicePoli(
    @Param('id') id: string,
    @Param('idFasyankes') idFasyankes: string,
  ) {
    return this.settingService.detailVoicePoli(+id, idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Delete('/hapusvoicepoli/:id/:idFasyankes')
  async deleteVoicePoli(
    @Param('id') id: string,
    @Param('idFasyankes') idFasyankes: string,
  ) {
    return this.settingService.deleteVoicePoli(+id, idFasyankes);
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
  @Get('/listdokter/:idFasyankes')
  async findAllDokter(@Param('idFasyankes') idFasyankes: string) {
    try {
      const data = await this.settingService.findAllDokter(idFasyankes);
      return { success: true, data };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
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
