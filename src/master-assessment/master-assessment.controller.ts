/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MasterAssessment } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMasterAssessmentDto } from './dto/create-master-assessment.dto';
import { UpdateMasterAsessmentDto } from './dto/update-master-assessment.dto';
import { MasterAssessmentService } from './master-assessment.service';

@Controller('master-assessment')
export class MasterAssessmentController {
    constructor (
        private readonly masterAssessmentService: MasterAssessmentService,
    ) {}

    @UseGuards(AuthGuard)
    @Get()
    async findAll() {
        return this.masterAssessmentService.findAll();
    }


    @UseGuards(AuthGuard)
    @Post('/create')
    async createAssessment(
        @Body() data: CreateMasterAssessmentDto,
    ): Promise<MasterAssessment> {
        try {
            return await this.masterAssessmentService.createAssessment(data)
        } catch (error) {
            console.error(error);
            throw new BadRequestException(
                error.message || 'Failed to create MasterAssessment entry',
            );
        }
    }

    @UseGuards(AuthGuard)
    @Patch ('/update/:id')
    async updateAssessment (
        @Param('id') id: number,
        @Body() UpdateMasterAsessmentDto: UpdateMasterAsessmentDto,
    ) : Promise<MasterAssessment> {
        return this.masterAssessmentService.updateAssessment({
            where: {
                id: Number(id),
            },
            data: UpdateMasterAsessmentDto,
        });
    }

    @UseGuards(AuthGuard)
    @Delete('/delete/:id')
    async deleteAssessment(@Param('id') id: number): Promise<MasterAssessment> {
        return this.masterAssessmentService.deleteAssessment({ id: Number(id) }); // Memanggil metode deleteAssessment dengan parameter
    }

}
