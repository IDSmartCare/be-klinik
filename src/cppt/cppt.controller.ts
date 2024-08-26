import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CpptService } from './cppt.service';
import { CreateCpptDto } from './dto/create-cppt.dto';
import { UpdateCpptDto } from './dto/update-cppt.dto';
import { SOAP } from '@prisma/client';

@Controller('cppt')
export class CpptController {
  constructor(private readonly cpptService: CpptService) { }

  @Post()
  async create(@Body() createCpptDto: CreateCpptDto) {
    return this.cpptService.create(createCpptDto);
  }

  @Get("/list/:idpasien/:idfasyankes")
  async findAll(@Param('idpasien') idpasien: string, @Param('idfasyankes') idfasyankes: string): Promise<SOAP[]> {
    return this.cpptService.findAll(idfasyankes, idpasien);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cpptService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCpptDto: UpdateCpptDto) {
    return this.cpptService.update(+id, updateCpptDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cpptService.remove(+id);
  }
}
