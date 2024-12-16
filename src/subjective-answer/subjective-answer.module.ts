import { Module } from '@nestjs/common';
import { SubjectiveAnswerService } from './subjective-answer.service';
import { SubjectiveAnswerController } from './subjective-answer.controller';
import { PrismaModule } from 'src/service/prisma.module';
@Module({
  controllers: [SubjectiveAnswerController],
  providers: [SubjectiveAnswerService],
  imports: [PrismaModule],
})
export class SubjectiveAnswerModule {}
