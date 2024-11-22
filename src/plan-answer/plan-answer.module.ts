import { Module } from '@nestjs/common';
import { PlanAnswerController } from './plan-answer.controller';
import { PlanAnswerService } from './plan-answer.service';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
    controllers: [PlanAnswerController],
    providers: [PlanAnswerService],
    imports: [PrismaModule],  
})
export class PlanAnswerModule {}
