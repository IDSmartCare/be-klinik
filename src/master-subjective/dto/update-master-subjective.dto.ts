/* eslint-disable prettier/prettier */

import { PartialType } from '@nestjs/mapped-types';
import { CreateMasterSubjectiveDto } from './create-master-subjective.dto';

export class UpdateMasterSubjectiveDto extends PartialType(
  CreateMasterSubjectiveDto,
) {
  idFasyankes?: string;
  text: string;
}
