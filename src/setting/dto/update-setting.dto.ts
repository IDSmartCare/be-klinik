import { PartialType } from '@nestjs/mapped-types';
import { CreatePoliDto } from './create-setting.dto';

export class UpdateSettingDto extends PartialType(CreatePoliDto) { }
