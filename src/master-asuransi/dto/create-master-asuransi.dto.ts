import { IsEmail } from "class-validator";


export class CreateMasterAsuransiDto {
    namaAsuransi: string;
    namaPic: string;
    alamat: string;

    @IsEmail()
    picEmail: string;

    picPhone: string;
    from: string;
    to: string;
    isAktif: boolean;
    // tarif: string;
    idFasyankes: string;
}