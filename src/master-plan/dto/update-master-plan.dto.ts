/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterPlanDto } from './create-master-plan.dto';

export class UpdateMasterPlanDto extends PartialType(CreateMasterPlanDto) {
  idFasyankes?: string;
  text: string;
}
