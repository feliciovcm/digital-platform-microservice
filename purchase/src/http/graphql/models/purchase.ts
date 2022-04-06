import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Product } from './product';

enum PurchaseStatus {
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  APPROVED = 'APPROVED',
}

registerEnumType(PurchaseStatus, {
  name: 'PurchaseStatus',
  description: 'Purchase Statuses',
});

@ObjectType()
export class Purchase {
  @Field(() => ID)
  id: string;

  @Field(() => PurchaseStatus)
  status: PurchaseStatus;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Product)
  product: Product;

  productId: string;
}
