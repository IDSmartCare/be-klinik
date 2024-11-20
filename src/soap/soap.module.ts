import { Module } from '@nestjs/common';
import { SoapService } from './soap.service';
import { SoapController } from './soap.controller';
import { PrismaService } from 'src/service/prisma.service';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
  controllers: [SoapController],
  providers: [SoapService],
  imports: [PrismaModule],
})
export class SoapModule {}
