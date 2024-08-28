import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PasienModule } from './pasien/pasien.module';
import { ConfigModule } from '@nestjs/config';
import { CpptModule } from './cppt/cppt.module';
import { ResepModule } from './resep/resep.module';
import { KasirModule } from './kasir/kasir.module';
import { SettingModule } from './setting/setting.module';

@Module({
  imports: [PasienModule, ConfigModule.forRoot({
    isGlobal: true
  }), CpptModule, ResepModule, KasirModule, SettingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
