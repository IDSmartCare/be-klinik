/* eslint-disable prettier/prettier */
export class CreateCpptDto {
    subjective: string
    objective: string
    assesment: string
    plan: string
    instruksi: string
    pendaftaranId: number
    profesi: string
    profileId: number
    isDokter: boolean
    isVerifDokter: boolean
    jamVerifDokter?: string
    resep: any
    kodeDiagnosa?: string
    namaDiagnosa?: string
    idFasyankes: string
}
