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
import { ObjectiveAnswerService } from './objective-answer.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateObjectiveAnswerDto } from './dto/create-objective-answer.dto';
import { Prisma } from '@prisma/client';
import { UpdateObjectiveAnswerDto } from './dto/update-objective-answer.dto';

@Controller('objective-answer')
export class ObjectiveAnswerController {
  constructor(
    private readonly objectiveAnswerService: ObjectiveAnswerService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.objectiveAnswerService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(@Body() createObjectiveAnswerDto: CreateObjectiveAnswerDto) {
    const result = await this.objectiveAnswerService.create(
      createObjectiveAnswerDto,
    );
    return { success: true, data: result };
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.objectiveAnswerService.findOne(+id);
    } catch (error) {
      throw new HttpException('Answer not found', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateObjectiveAnswerDto,
  ) {
    try {
      const updatedAnswer = await this.objectiveAnswerService.update(+id, data);
      return { message: 'Update successful', data: updatedAnswer}
    } catch (error) {
      throw new HttpException('Update failed', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
      return await this.objectiveAnswerService.delete(+id);
    } catch (error) {
      throw new HttpException('Delete failed', HttpStatus.BAD_REQUEST);
    }
  }
}
