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
import { InstructionAnswerService } from './instruction-answer.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateInstructionDto } from './dto/create-instruction-answer.dto';
import { UpdateInstructionAnswerDto } from './dto/update-instruction-answer.dto';

@Controller('instruction-answer')
export class InstructionAnswerController {
  constructor(
    private readonly instructionAnswerService: InstructionAnswerService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return this.instructionAnswerService.findAll();
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  async create(@Body() createInstructionDto: CreateInstructionDto) {
    try {
      const result =
        await this.instructionAnswerService.create(createInstructionDto);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @UseGuards(AuthGuard)
  @Get('/detail/:id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.instructionAnswerService.findOne(+id);
    } catch (error) {
      throw new HttpException('Answer not found', HttpStatus.NOT_FOUND);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/update/:id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateInstructionAnswerDto,
  ) {
    try {
      return await this.instructionAnswerService.update(+id, data);
    } catch (error) {
      throw new HttpException('Update failed', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('/delete/:id')
  async delete(@Param('id') id: string) {
    try {
      return await this.instructionAnswerService.delete(+id);
    } catch (error) {
      throw new HttpException('Delete failed', HttpStatus.BAD_REQUEST);
    }
  }
}
