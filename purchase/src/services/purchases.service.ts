import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { KafkaService } from 'src/messaging/kafka.service';
import { CustomerService } from './customer.service';

interface ICreatePurchase {
  productId: string;
  customerId: string;
}

@Injectable()
export class PurchasesService {
  constructor(
    private prisma: PrismaService,
    private customerService: CustomerService,
    private kafkaService: KafkaService,
  ) {}

  listAllPurchases() {
    return this.prisma.purchase.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  listAllPurchasesByCustomerId(customerId: string) {
    return this.prisma.purchase.findMany({
      where: {
        customerId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async createPurchase({ productId, customerId }: ICreatePurchase) {
    let customer = await this.customerService.findCustomerByAuthUserId(
      customerId,
    );

    if (!customer) {
      customer = await this.customerService.createCustomer({
        authUserId: customerId,
      });
    }

    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    const purchase = this.prisma.purchase.create({
      data: {
        customerId: customer.id,
        productId,
      },
    });

    this.kafkaService.emit('purchase.new-purchase', {
      customer: {
        authUserId: customerId,
      },
      product: {
        id: product.id,
        title: product.title,
        slug: product.slug,
      },
    });

    return purchase;
  }
}
