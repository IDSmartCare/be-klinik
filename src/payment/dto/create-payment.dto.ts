export class CreatePaymentDto {
    orderId: string;
    amount: number;
    reference: string;
    paymentType: string;
    paymentChannel: string;
    paymentCode?: string;
    paymentStatus: string;
    grossAmount: number;
}