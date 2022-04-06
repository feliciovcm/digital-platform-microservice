import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from 'src/database/prisma/prisma.service';

interface ICreateProduct {
  title: string;
}

interface IFindProductById {
  productId: string;
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  listAllProducts() {
    return this.prisma.product.findMany();
  }

  findProductById({ productId }: IFindProductById) {
    return this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
  }

  async createProduct({ title }: ICreateProduct) {
    const slug = slugify(title, { lower: true });

    const productWithSameSlug = await this.prisma.product.findUnique({
      where: {
        slug,
      },
    });

    if (productWithSameSlug) {
      throw new Error('Product with same slug already exists');
    }

    return this.prisma.product.create({
      data: {
        slug,
        title,
      },
    });
  }
}
