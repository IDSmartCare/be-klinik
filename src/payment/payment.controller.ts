import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('finnet-payment')
export class PasienController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(@Body() data: CreatePaymentDto) {
    try {
      const result = await this.paymentService.createPayment(data);
      return {
        status: 'success',
        message: 'Payment created successfully',
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          message: 'Failed to create payment',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
