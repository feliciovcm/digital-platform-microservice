import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Enrollment } from './enrollment';

@ObjectType('User')
@Directive('@extends') // this directive will extends the directive from customer and add enrollment
@Directive('@key(fields: "authUserId")') // add the key to be equal between both services
export class Student {
  id: string;

  @Field(() => ID)
  @Directive('@external') // this field will come from external (purchase service)
  authUserId: string;

  @Field(() => [Enrollment])
  enrollments: Enrollment[];
}
