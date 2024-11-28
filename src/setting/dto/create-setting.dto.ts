/* eslint-disable prettier/prettier */
export class CreatePoliDto {
  namaPoli: string;
  kodePoli?: string;
  idFasyankes: string;
  voiceId: number;
}

export class CreateJadwalDto {
  hari: string;
  kodeHari: number;
  dokterId: number;
  jamPraktek: string;
  idFasyankes: string;
}
