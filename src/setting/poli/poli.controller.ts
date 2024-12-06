import { Body, Controller, Delete, Param, Patch, UseGuards } from '@nestjs/common';
import { PoliService } from './poli.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PoliKlinik } from '@prisma/client';
import { UpdatePoliKlinikStatusDto } from './dto/update-poli.dto';

@Controller('poli')
export class PoliController {
    constructor(private readonly poliService: PoliService){}

    @UseGuards(AuthGuard)
    @Patch('/editpoli/:id')
    async updatePoli(
        @Param('id') id: string,
        @Body() updatePoliKlinikStatusDto: UpdatePoliKlinikStatusDto,
    ) {
        const { isAktif } = updatePoliKlinikStatusDto;
        return this.poliService.updatePoliStatus(Number(id), isAktif);
    }

    @UseGuards(AuthGuard)
    @Delete('/delete/:id')
    async deletePoli(
        @Param('id') id: string,
    ): Promise<{message: string; data?: PoliKlinik}> {
        return this.poliService.deletePoli({ id: Number(id)});
    }
}
