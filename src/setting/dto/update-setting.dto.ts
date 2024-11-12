/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreatePoliDto } from './create-setting.dto';

export class UpdateSettingDto extends PartialType(CreatePoliDto) {}

export class UpdateJadwalDto {
  hari: string;
  kodeHari: number;
  jamPraktek: string;
  idFasyankes: string;
}
