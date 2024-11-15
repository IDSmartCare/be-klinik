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

@Controller('master-asuransi')
export class MasterAsuransiController {
  constructor(private readonly masterAsuransiService: MasterAsuransiService) {}

  @UseGuards(AuthGuard)
  @Get()
  async listAsuransi() {
    return this.masterAsuransiService.listAsuransi();
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
  @Patch('updateasuransi/:id')
  async updateAsuransi(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateData: UpdateMasterAsuransiDto,
  ): Promise<{ success: boolean; message: string; data: MasterAsuransi }> {
    return this.masterAsuransiService.updateAsuransi(id, updateData);
  }
  
  

  @UseGuards(AuthGuard)
  @Delete('hapusasuransi/:id')
  async deleteAsuransi(
    @Param('id') id: number,
    @Body('idFasyankes') idFasyankes: string,
  ): Promise<{ message: string; data?: any }> {
    return this.masterAsuransiService.deleteAsuransi(id, idFasyankes);
  }
}
