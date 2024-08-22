import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PasienModule } from './pasien/pasien.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PasienModule, ConfigModule.forRoot({
    isGlobal: true
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
