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
  Query,
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
  @Patch('update/:id')
  async updateAsuransi(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateMasterAsuransiDto,
  ): Promise<{ success: boolean; message: string; data: MasterAsuransi }> {
    return this.masterAsuransiService.updateAsuransi(
      id,
      updateData,
    ) as Promise<{ success: boolean; message: string; data: MasterAsuransi }>;
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async deleteAsuransi(
    @Param('id') id: string,
    @Body('idFasyankes') idFasyankes: string,
  ): Promise<{ message: string; data?: any }> {
    return this.masterAsuransiService.deleteAsuransi(id, idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Get(':id/:idFasyankes')
  async findByIdWithResponse(
    @Param('id') id: number,
    @Param('idFasyankes') idFasyankes: string,
  ) {
    try {
      const result = await this.masterAsuransiService.findByIdWithResponse(
        id,
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

  @UseGuards(AuthGuard)
  @Get('/ambilbyfromto')
  async getAllByFromTo (
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    if (!from || !to) {
      throw new HttpException(
        {
          success: false,
          message: 'Parameter "from" dan "to" harus disediakan.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.masterAsuransiService.ambilByFromTo(from, to);
  
}
}
