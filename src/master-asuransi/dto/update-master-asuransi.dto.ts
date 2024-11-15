import { IsEmail } from 'class-validator';

export class UpdateMasterAsuransiDto {
  namaPic?: string;

  @IsEmail()
  picEmail?: string;

  picPhone?: string;

  from?: string;

  to?: string;

  idFasyankes?: string;
}
