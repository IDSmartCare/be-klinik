import { Controller } from '@nestjs/common';
import { AntrianService } from './antrian.service';

@Controller('antrian')
export class AntrianController {
    constructor(private readonly antrianService: AntrianService) {}

    
}
