import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface ICreateCustomer {
  authUserId: string;
}

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  findCustomerByAuthUserId(authUserId: string) {
    return this.prisma.customer.findUnique({
      where: {
        authUserId,
      },
    });
  }

  async createCustomer({ authUserId }: ICreateCustomer) {
    return await this.prisma.customer.create({
      data: {
        authUserId,
      },
    });
  }
}
