import { Module } from '@nestjs/common';
import { InstructionAnswerController } from './instruction-answer.controller';
import { InstructionAnswerService } from './instruction-answer.service';
import { PrismaModule } from 'src/service/prisma.module';

@Module({
    controllers: [InstructionAnswerController],
    providers: [InstructionAnswerService],
    imports: [PrismaModule],
})
export class InstructionAnswerModule {}
