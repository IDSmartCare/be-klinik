export class CreatePoliDto {
  namaPoli: string;
  kodePoli?: string;
  idFasyankes: string;
}

export class CreateJadwalDto {
  hari: string;
  kodeHari: number;
  dokterId: number;
  jamPraktek: string;
  idFasyankes: string;
}
