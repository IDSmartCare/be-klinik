/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MasterPlanService } from './master-plan.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMasterPlanDto } from './dto/create-master-plan.dto';
import { MasterPlan } from '@prisma/client';
import { UpdateMasterPlanDto } from './dto/update-master-plan.dto';

@Controller('master-plan')
export class MasterPlanController {
    constructor(
        private readonly MasterPlanService: MasterPlanService,
    ) {}

    @UseGuards(AuthGuard)
    async findAll() {
        return this.MasterPlanService.findAll();
    }

    @UseGuards(AuthGuard)
    @Post('/create')
    async createPlan(
        @Body() data: CreateMasterPlanDto,
    ) : Promise<MasterPlan> {
        try {
            return await this.MasterPlanService.createPlan(data)
        } catch (error) {
            console.error(error);
            throw new BadRequestException (
                error.message || 'Failed to Create',
            )
        }
    }


    @UseGuards(AuthGuard)
    @Patch('/update/:id')
    async updatePlan (
        @Param('id') id: number,
        @Body() UpdateMasterPlanDto: UpdateMasterPlanDto,
    ): Promise<MasterPlan> {

        return this.MasterPlanService.updatePlan({
            where: {
                id: Number(id),
            },
            data: UpdateMasterPlanDto,
        });
    }

    @UseGuards(AuthGuard)
    @Delete('/delete/:id')
    async deletePlan(@Param('id') id: number): Promise<MasterPlan> {
        return this.MasterPlanService.deletePlan({ id: Number(id) }); // Memanggil metode deleteUser dengan parameter
    }
}