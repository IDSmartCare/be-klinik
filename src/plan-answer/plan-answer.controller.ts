import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PlanAnswerService } from './plan-answer.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreatePlanAnswerDto } from './dto/create-plan-answer.dto';
import { Prisma } from '@prisma/client';
import { UpdatePlanAnswerDto } from './dto/update-plan-answer.dto';

@Controller('plan-answer')
export class PlanAnswerController {
  constructor(private readonly planAnswerService: PlanAnswerService) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.planAnswerService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(@Body() createPlanAnswerDto: CreatePlanAnswerDto) {
    const result = await this.planAnswerService.create(createPlanAnswerDto);
    return { success: true, data: result };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.planAnswerService.findOne(+id);
    } catch (error) {
      throw new HttpException(' Answer not found', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(@Param('id') id: string, @Body() data: UpdatePlanAnswerDto) {
    try {
      const updatedAnswer = await this.planAnswerService.update(+id, data);
      return { message: 'Update successful', data: updatedAnswer };
    } catch (error) {
      throw new HttpException('Update failed', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    try {
      return await this.planAnswerService.delete(+id);
    } catch (error) {
      throw new HttpException('Delete failed', HttpStatus.BAD_REQUEST);
    }
  }
}
