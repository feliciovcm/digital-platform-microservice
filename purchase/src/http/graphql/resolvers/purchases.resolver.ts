import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user.decorator';
import { ProductsService } from 'src/services/products.service';
import { PurchasesService } from 'src/services/purchases.service';
import { CreatePurchaseInput } from '../inputs/create-purchase-input';
import { Purchase } from '../models/purchase';

@Resolver(() => Purchase)
export class PurchasesResolver {
  constructor(
    private purchasesService: PurchasesService,
    private productsService: ProductsService,
  ) {}

  @Query(() => [Purchase])
  // @UseGuards(AuthorizationGuard)
  purchases() {
    return this.purchasesService.listAllPurchases();
  }

  @ResolveField()
  product(@Parent() purchase: Purchase) {
    const { productId } = purchase;
    return this.productsService.findProductById({ productId });
  }

  @Mutation(() => Purchase)
  @UseGuards(AuthorizationGuard)
  createPurchase(
    @Args('data') data: CreatePurchaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    return this.purchasesService.createPurchase({
      productId: data.productId,
      customerId: user.sub,
    });
  }
}
