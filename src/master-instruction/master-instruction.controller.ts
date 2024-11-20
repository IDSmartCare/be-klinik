/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { MasterObjective } from '@prisma/client';
import { MasterInstructionService } from './master-instruction.service';
import { CreateMasterInstructionDto } from './dto/create-master-instruction.dto';

@Controller('master-instruction')
export class MasterInstructionController {
  constructor(
    private readonly MasterInstructionService: MasterInstructionService,
  ) {}

  @UseGuards(AuthGuard)
  @Get(':idFasyankes')
  async getObjective(@Param('idFasyankes') idFasyankes: string) {
    return this.MasterInstructionService.getInstruction(idFasyankes);
  }

  @UseGuards(AuthGuard)
  @Post('/create')
  async createObjective(
    @Body() data: CreateMasterInstructionDto,
  ): Promise<MasterObjective> {
    try {
      return await this.MasterInstructionService.createInstruction(data);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(error.massage || 'Failed to Create');
    }
  }

//   @UseGuards(AuthGuard)
//   @Patch('/update/:id')
//   async updateObjective(
//     @Param('id') id: number,
//     @Body() UpdateMasterObjectiveDto: UpdateMasterObjectiveDto,
//   ): Promise<MasterObjective> {
//     return this.MasterObjectiveService.updateObjective({
//       where: {
//         id: Number(id),
//       },
//       data: UpdateMasterObjectiveDto,
//     });
//   }

//   @UseGuards(AuthGuard)
//   @Delete('/delete/:id')
//   async deleteUser(@Param('id') id: number): Promise<MasterObjective> {
//     return this.MasterObjectiveService.deleteUser({ id: Number(id) }); // Memanggil metode deleteUser dengan parameter
//   }
}
