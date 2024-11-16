import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
  @Patch('update/:id')
  async updateAsuransi(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateMasterAsuransiDto,
  ): Promise<{ success: boolean; message: string; data: MasterAsuransi }> {
    return this.masterAsuransiService.updateAsuransi(id, updateData);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async deleteAsuransi(
    @Param('id') id: string,
    @Body('idFasyankes') idFasyankes: string,
  ): Promise<{ message: string; data?: any }> {
    return this.masterAsuransiService.deleteAsuransi(id, idFasyankes);
  }
}
