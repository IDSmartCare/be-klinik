import { PartialType } from '@nestjs/mapped-types';
import { CreateResepDto } from './create-resep.dto';

export class UpdateResepDto extends PartialType(CreateResepDto) {}
