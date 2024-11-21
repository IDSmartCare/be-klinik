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
    // Call the service to create the new answer with validated data
    const result = await this.subjectiveAnswerService.create(
      createSubjectiveAnswerDto,
    );
    return { success: true, data: result };
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
    @Body() data: Prisma.SubjectiveAnswerUpdateInput,
  ) {
    try {
      return await this.subjectiveAnswerService.update(+id, data);
    } catch (error) {
      throw new HttpException('Update failed', HttpStatus.BAD_REQUEST);
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
