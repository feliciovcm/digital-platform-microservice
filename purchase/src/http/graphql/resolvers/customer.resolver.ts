import { UseGuards } from '@nestjs/common';
import {
  Parent,
  Query,
  ResolveField,
  Resolver,
  ResolveReference,
} from '@nestjs/graphql';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';
import { AuthUser, CurrentUser } from 'src/http/auth/current-user.decorator';
import { CustomerService } from 'src/services/customer.service';
import { PurchasesService } from 'src/services/purchases.service';
import { Customer } from '../models/customer';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    private customerService: CustomerService,
    private purchasesService: PurchasesService,
  ) {}

  @Query(() => Customer)
  @UseGuards(AuthorizationGuard)
  me(@CurrentUser() user: AuthUser) {
    return this.customerService.findCustomerByAuthUserId(user.sub);
  }

  @ResolveField()
  purchases(@Parent() customer: Customer) {
    const { id } = customer;
    return this.purchasesService.listAllPurchasesByCustomerId(id);
  }
  // Make this resolver the reference to the user, for the frontend application,
  // since customer here and student at classroom are the same thing
  @ResolveReference()
  resolveReference(reference: { authUserId: string }) {
    return this.customerService.findCustomerByAuthUserId(reference.authUserId);
  }
}
