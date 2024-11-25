import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AntrianService } from './antrian.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateAntrianAdmisiDto } from './dto/create-admisi.dto';

@Controller('antrian')
export class AntrianController {
    constructor(private readonly antrianService: AntrianService) {}

    @UseGuards(AuthGuard)
    @Post('/store-admisi')
    async storeAntrianAdmisi(@Body() dto: CreateAntrianAdmisiDto) {
      return await this.antrianService.storeAntrianAdmisi(dto);
    }
}
