import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SubjectiveAnswerService } from './subjective-answer.service';
import { Prisma } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateSubjectiveAnswerDto } from './dto/create-subjective-answer.dto';
import { UpdateSubjectiveAnswerDto } from './dto/update-subjective-answer.dto';

@Controller('subjective-answer')
export class SubjectiveAnswerController {
  constructor(
    private readonly subjectiveAnswerService: SubjectiveAnswerService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.subjectiveAnswerService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(@Body() createSubjectiveAnswerDto: CreateSubjectiveAnswerDto) {
    try {
      const result = await this.subjectiveAnswerService.create(
        createSubjectiveAnswerDto,
      );
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  } 

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.subjectiveAnswerService.findOne(+id);
    } catch (error) {
      throw new HttpException('Answer not found', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateSubjectiveAnswerDto,
  ) {
    try {
      const updatedAnswer = await this.subjectiveAnswerService.update(
        +id,
        data,
      );
      return { message: 'Update successful', data: updatedAnswer };
    } catch (error) {
      throw new HttpException(
        error.message || 'Update failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/:id')
  async delete(@Param('id') id: string) {
    try {
      return await this.subjectiveAnswerService.delete(+id);
    } catch (error) {
      throw new HttpException('Delete failed', HttpStatus.BAD_REQUEST);
    }
  }
}
