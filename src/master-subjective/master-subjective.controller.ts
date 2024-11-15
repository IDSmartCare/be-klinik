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
  @Get()
  async findAll() {
    return this.MasterSubjectiveService.findAll();
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
  @Patch('/update/:id')
  async updateSubjective(
    @Param('id') id: number,
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
    return this.MasterSubjectiveService.deleteUser({ id: Number(id) }); // Memanggil metode deleteUser dengan parameter
  }
}
