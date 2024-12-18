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
import { MasterAssessment } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMasterAssessmentDto } from './dto/create-master-assessment.dto';
import { MasterAssessmentService } from './master-assessment.service';
import { UpdateMasterAssessmentDto } from './dto/update-master-assessment.dto';

@Controller('master-assessment')
export class MasterAssessmentController {
  constructor(
    private readonly masterAssessmentService: MasterAssessmentService,
  ) {}

  @UseGuards(AuthGuard)
  @Get(':idFasyankes')
  async getAssessment(@Param('idFasyankes') idFAsyankes: string) {
    return this.masterAssessmentService.getAssessment(idFAsyankes);
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  async createAssessment(
    @Body() data: CreateMasterAssessmentDto,
  ): Promise<MasterAssessment> {
    try {
      return await this.masterAssessmentService.createAssessment(data);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        error.message || 'Failed to create MasterAssessment entry',
      );
    }
  }

  @UseGuards(AuthGuard)
  @Get('/detail/:id')
  async getSubjectiveDetail(@Param('id') id: string) {
    const result = await this.masterAssessmentService.getAssessmentDetail(+id);
    return { success: true, data: result };
  }

  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  async updateAssessment(
    @Param('id') id: number,
    @Body() UpdateMasterAsessmentDto: UpdateMasterAssessmentDto,
  ): Promise<MasterAssessment> {
    return this.masterAssessmentService.updateAssessment({
      where: {
        id: Number(id),
      },
      data: UpdateMasterAsessmentDto,
    });
  }

  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  async deleteAssessment(@Param('id') id: string): Promise<MasterAssessment> {
    return this.masterAssessmentService.deleteAssessment({ id: Number(id) }); // Memanggil metode deleteAssessment dengan parameter
  }
}
