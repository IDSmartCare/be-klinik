// subjective-answer/dto/create-subjective-answer.dto.ts

export class CreateSubjectiveAnswerDto {
  questionId: number;
  answer: string;
  createdBy: string;
}
