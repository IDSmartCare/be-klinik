/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MasterObjectiveService } from './master-objective.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMasterObjectiveDto } from './dto/create-master-objective.dto';
import { MasterObjective } from '@prisma/client';
import { UpdateMasterObjectiveDto } from './dto/update-master-objective.dto';

@Controller('master-objective')
export class MasterObjectiveController {
    constructor(
        private readonly MasterObjectiveService: MasterObjectiveService,
    ) {}

    @UseGuards(AuthGuard)
    @Get()
    async findAll() {
        return this.MasterObjectiveService.findAll();
    }


    @UseGuards(AuthGuard)
    @Post('/create')
    async createObjective(
        @Body() data: CreateMasterObjectiveDto,
    ): Promise<MasterObjective> {
        try {
            return await this.MasterObjectiveService.createObjective(data)
        } catch (error) {
            console.error(error);
            throw new BadRequestException (
                error.massage || 'Failed to Create',
            );
        }
    }

    @UseGuards(AuthGuard)
    @Patch('/update/:id')
    async updateObjective (
        @Param('id') id: number,
        @Body() UpdateMasterObjectiveDto: UpdateMasterObjectiveDto,
    ): Promise<MasterObjective> {

        return this.MasterObjectiveService.updateObjective({
            where: {
                id: Number (id),
            },
            data: UpdateMasterObjectiveDto,
        });
    }


    @UseGuards(AuthGuard)
    @Delete('/delete/:id')
    async deleteUser(@Param('id') id: number): Promise<MasterObjective> {
        return this.MasterObjectiveService.deleteUser({ id: Number(id) }); // Memanggil metode deleteUser dengan parameter
    }
}
