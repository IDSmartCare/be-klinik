export class CreateCpptDto {
  pendaftaranId: number;
  profesi: string;
  profileId: number;
  isDokter: boolean;
  isVerifDokter: boolean;
  jamVerifDokter?: string;
  resep: any;
  kodeDiagnosa?: string;
  namaDiagnosa?: string;
  idFasyankes: string;
  soap: any;
}
