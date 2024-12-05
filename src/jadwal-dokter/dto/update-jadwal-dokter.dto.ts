class TimeRangeDto {
  from: string;
  to: string;
}
export class UpdateJadwalDokterDto {
  dokter_id: number;
  days: string[];
  times: TimeRangeDto[];
  slot: number;
}
