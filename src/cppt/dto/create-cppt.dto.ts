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
  subjective: any;
  objective: any;
  assessment: any;
  plan: any;
  instruction: any;
}
