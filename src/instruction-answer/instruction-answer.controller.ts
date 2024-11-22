import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { InstructionAnswerService } from './instruction-answer.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateInstructionDto } from './dto/create-instruction-answer.dto';
import { UpdateInstructionDto } from './dto/update-instruction-answer.dto';

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
            const result = await this.instructionAnswerService.create(
                createInstructionDto,
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
            return await this.instructionAnswerService.findOne(+id);
        } catch (error) {
            throw new HttpException('Answer not found', HttpStatus.NOT_FOUND);
        }
    }

    @UseGuards(AuthGuard)
    @Patch('/:id')
    async update(
        @Param('id') id: string,
        @Body() data: UpdateInstructionDto,
    ) {
        try {
            const updatedAnswer = await this.instructionAnswerService.update(
                +id,
                data,
            )
        } catch (error) {
            throw new HttpException('Update failed', HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard)
    @Delete('/:id')
    async delete(@Param('id') id: string) {
        try {
            return await this.instructionAnswerService.delete(+id);
        } catch (error) {
            throw new HttpException('Delete failed', HttpStatus.BAD_REQUEST);
        }
    }
}
