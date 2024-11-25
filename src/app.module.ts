/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PasienModule } from './pasien/pasien.module';
import { ConfigModule } from '@nestjs/config';
import { CpptModule } from './cppt/cppt.module';
import { ResepModule } from './resep/resep.module';
import { KasirModule } from './kasir/kasir.module';
import { SettingModule } from './setting/setting.module';
import { MasterTarifModule } from './setting/tarif/master-tarif.module';
import { MasterSubjectiveModule } from './master-subjective/master-subjective.module';
import { MasterObjectiveModule } from './master-objective/master-objective.module';
import { MasterPlanModule } from './master-plan/master-plan.module';
import { MasterAssessmentModule } from './master-assessment/master-assessment.module';
import { DoctorsModule } from './aidiva/doctors/doctors.module';
import { DoctorAvailableDaysModule } from './aidiva/doctor_available_days/doctor_available_days.module';
import { DoctorAvailableTimesModule } from './aidiva/doctor_available_times/doctor_available_times.module';
import { DoctorAvailableSlotsModule } from './aidiva/doctor_available_slots/doctor_available_slots.module';
import { DoctorsModule as DoctorsCoreModule } from './doctors/doctors.module';
import { JadwalDokterModule } from './jadwal-dokter/jadwal-dokter.module';
import { MasterAsuransiModule } from './master-asuransi/master-asuransi.module';
import { DoctorCostsModule } from './aidiva/doctor_costs/doctor_costs.module';
import { MasterInstructionModule } from './master-instruction/master-instruction.module';
import { SoapModule } from './soap/soap.module';
import { SubjectiveAnswerModule } from './subjective-answer/subjective-answer.module';
import { ObjectiveAnswerModule } from './objective-answer/objective-answer.module';
import { AssessmentAnswerModule } from './assessment-answer/assessment-answer.module';
import { PlanAnswerModule } from './plan-answer/plan-answer.module';
import { InstructionAnswerModule } from './instruction-answer/instruction-answer.module';

@Module({
  imports: [
    PasienModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CpptModule,
    ResepModule,
    KasirModule,
    SettingModule,
    MasterTarifModule,
    MasterSubjectiveModule,
    MasterObjectiveModule,
    MasterPlanModule,
    MasterAssessmentModule,
    DoctorsModule,
    DoctorsCoreModule,
    DoctorAvailableDaysModule,
    DoctorAvailableTimesModule,
    DoctorAvailableSlotsModule,
    JadwalDokterModule,
    MasterAsuransiModule,
    DoctorCostsModule,
    MasterInstructionModule,
    SoapModule,
    SubjectiveAnswerModule,
    ObjectiveAnswerModule,
    AssessmentAnswerModule,
    PlanAnswerModule,
    InstructionAnswerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
