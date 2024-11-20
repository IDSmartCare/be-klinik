import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { MasterAsuransiService } from './master-asuransi.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMasterAsuransiDto } from './dto/create-master-asuransi.dto';
import { MasterAsuransi } from '@prisma/client';
import { UpdateMasterAsuransiDto } from './dto/update-master-asuransi.dto';

@Controller('masterasuransi')
export class MasterAsuransiController {
  constructor(private readonly masterAsuransiService: MasterAsuransiService) {}

  @UseGuards(AuthGuard)
  @Get(':idFasyankes')
  async listAsuransi(@Param('idFasyankes') idFasyankes: string) {
    return this.masterAsuransiService.listAsuransi(idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(
    @Body(new ValidationPipe())
    createMasterAsuransiDto: CreateMasterAsuransiDto,
  ) {
    return this.masterAsuransiService.create(createMasterAsuransiDto);
  }

  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  async updateAsuransi(
    @Param('id') id: string,
    @Body() updateData: UpdateMasterAsuransiDto,
  ): Promise<{ success: boolean; message: string; data: MasterAsuransi }> {
    return this.masterAsuransiService.updateAsuransi(
      Number(id),
      updateData.idFasyankes,
      updateData,
    ) as Promise<{ success: boolean; message: string; data: MasterAsuransi }>;
  }

  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  async deleteAsuransi(
    @Param('id') id: string,
    @Body('idFasyankes') idFasyankes: string,
  ): Promise<{ message: string; data?: any }> {
    return this.masterAsuransiService.deleteAsuransi(id, idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Get('/:id/:idFasyankes')
  async findByIdWithResponse(
    @Param('id') id: string,
    @Param('idFasyankes') idFasyankes: string,
  ) {
    try {
      const result = await this.masterAsuransiService.findByIdWithResponse(
        Number(id),
        idFasyankes,
      );
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error fetching data:', error);
      throw new Error('Terjadi kesalahan pada server.');
    }
  }
}
