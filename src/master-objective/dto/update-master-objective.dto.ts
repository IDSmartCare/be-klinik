/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterObjectiveDto } from './create-master-objective.dto';

export class UpdateMasterObjectiveDto extends PartialType(
  CreateMasterObjectiveDto,
) {
  idFasyankes?: string;
  text: string;
}
