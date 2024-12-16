import { Module } from '@nestjs/common';
import { ObjectiveAnswerController } from './objective-answer.controller';
import { ObjectiveAnswerService } from './objective-answer.service';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
    controllers: [ObjectiveAnswerController],
    providers: [ObjectiveAnswerService],
    imports: [PrismaModule],
})
export class ObjectiveAnswerModule {}
