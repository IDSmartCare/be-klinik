class TimeRangeDto {
  from: string;

  to: string;
}

export class CreateJadwalDokterDto {
  dokter_id: number;
  slot: number;
  days: string[];
  times: TimeRangeDto[];
}
