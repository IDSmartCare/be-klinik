/* eslint-disable prettier/prettier */

import { PartialType } from "@nestjs/mapped-types";
import { CreateMasterAssessmentDto } from "./create-master-assessment.dto";



export class UpdateMasterAsessmentDto extends PartialType(CreateMasterAssessmentDto){
    text: string; 
}