/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MasterSubjectiveService } from './master-subjective.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMasterSubjectiveDto } from './dto/create-master-subjective.dto';
import { MasterSubjective } from '@prisma/client';
import { UpdateMasterSubjectiveDto } from './dto/update-master-subjective.dto';

@Controller('master-subjective')
export class MasterSubjectiveController {
  constructor(
    private readonly MasterSubjectiveService: MasterSubjectiveService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/:idFasyankes')
  async getSubjective(@Param('idFasyankes') idFasyankes: string) {
    return this.MasterSubjectiveService.getSubjective(idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  async createSubjective(
    @Body() data: CreateMasterSubjectiveDto,
  ): Promise<MasterSubjective> {
    try {
      return await this.MasterSubjectiveService.createSubjective(data);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        error.message || 'Failed to create MasterSubjective entry',
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('/detail/:id')
  async getSubjectiveDetail(@Param('id') id: string) {
    const result = await this.MasterSubjectiveService.getSubjectiveDetail(+id);
    return { success: true, data: result };
  }

  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  async updateSubjective(
    @Param('id') id: string,
    @Body() UpdateMasterSubjectiveDto: UpdateMasterSubjectiveDto,
  ): Promise<MasterSubjective> {
    return this.MasterSubjectiveService.updateSubjective({
      where: {
        id: Number(id),
      },
      data: UpdateMasterSubjectiveDto,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  async deleteUser(@Param('id') id: number): Promise<MasterSubjective> {
    return this.MasterSubjectiveService.deleteUser({ id: Number(id) });
  }
}
