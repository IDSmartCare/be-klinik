export class RegisPasienDto {
  pasienId: number;
  doctorId?: number;
  // jadwalDokterId?: number;
  idFasyankes: string;
  penjamin: string;
  namaAsuransi?: string;
  availableDayId?: number;
  availableTimeId?: number;
}
