import { PartialType } from '@nestjs/mapped-types';
import { CreatePasienDto } from './create-pasien.dto';

export class UpdatePasienDto extends PartialType(CreatePasienDto) {
    isAktif?: boolean;
}
