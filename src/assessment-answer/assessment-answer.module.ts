import { Module } from '@nestjs/common';
import { AssessmentAnswerController } from './assessment-answer.controller';
import { AssessmentAnswerService } from './assessment-answer.service';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
    controllers: [ AssessmentAnswerController],
    providers: [ AssessmentAnswerService],
    imports: [ PrismaModule]
})
export class AssessmentAnswerModule {}
