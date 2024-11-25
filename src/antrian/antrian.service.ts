import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service/prisma.service';

@Injectable()
export class AntrianService {
  constructor(private prisma: PrismaService) {}

  async storeAntrianAdmisi() {
    
  }
}
