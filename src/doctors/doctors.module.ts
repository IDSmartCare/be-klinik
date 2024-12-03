import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  providers: [DoctorsService],
  controllers: [DoctorsController],
  imports: [PrismaModule],
  exports: [DoctorsService],
})
export class DoctorsModule {}
