import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AssessmentAnswerService } from './assessment-answer.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAssessmentAnswerDto } from './dto/create-assessment-answer.dto';
import { Prisma } from '@prisma/client';
import { UpdateAssessmentAnswerDto } from './dto/update-assessment-answer.dto';

@Controller('assessment-answer')
export class AssessmentAnswerController {
    constructor (
        private assessmentAnswerService: AssessmentAnswerService,
    ) {}

    @UseGuards(AuthGuard)
    @Get()
    async findAll() {
        return this.assessmentAnswerService.findAll();
    }

    @UseGuards(AuthGuard)
    @Post('/create')
    async create(@Body() createAssessmentAnswerDto: CreateAssessmentAnswerDto) {
        const result = await this.assessmentAnswerService.create(
            createAssessmentAnswerDto,
        );
        return { success: true, data: result };
    }

    @UseGuards(AuthGuard)
    @Get('/detail/:id')
    async findOne(@Param('id') id: string) {
        try {
            return await this.assessmentAnswerService.findOne(+id);
        } catch (error) {
            throw new HttpException('Answer not found', HttpStatus.NOT_FOUND);
        }
    }

    @UseGuards(AuthGuard)
    @Patch('/update/:id')
    async update(
        @Param('id') id: string,
        @Body() data: UpdateAssessmentAnswerDto,
    ) {
        try {
            const updatedAnswer =  await this.assessmentAnswerService.update(+id, data);
            return { message: 'Update Successful', data: updatedAnswer}
        } catch (error) {
            throw new HttpException('Update failed', HttpStatus.BAD_REQUEST);
        }
    }

    @UseGuards(AuthGuard)
    @Delete('/delete/:id')
    async delete(@Param('id') id: string) {
        try {
            return await this.assessmentAnswerService.delete(+id);
        } catch (error) {
            throw new HttpException('Delete failed', HttpStatus.BAD_REQUEST);
        }
    }

}
