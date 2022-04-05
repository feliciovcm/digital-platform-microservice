import { UseGuards } from '@nestjs/common';
import { Int, Query, Resolver } from '@nestjs/graphql';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AuthorizationGuard } from 'src/http/auth/authorization.guard';

@Resolver()
export class TestResolver {
  constructor(private prisma: PrismaService) {}
  @Query(() => Int)
  @UseGuards(AuthorizationGuard)
  hello() {
    return 100;
  }
}
