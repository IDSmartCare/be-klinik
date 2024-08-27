import { Module } from '@nestjs/common';
import { ResepService } from './resep.service';
import { ResepController } from './resep.controller';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  controllers: [ResepController],
  providers: [ResepService],
  imports: [PrismaModule]
})
export class ResepModule { }
