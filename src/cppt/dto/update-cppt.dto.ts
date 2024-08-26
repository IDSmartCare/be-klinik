import { PartialType } from '@nestjs/mapped-types';
import { CreateCpptDto } from './create-cppt.dto';

export class UpdateCpptDto extends PartialType(CreateCpptDto) {}
