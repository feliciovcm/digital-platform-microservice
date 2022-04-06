import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { DatabaseModule } from 'src/database/database.module';
import path from 'node:path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProductsResolver } from './graphql/resolvers/products.resolver';
import { ProductsService } from 'src/services/products.service';
import { PurchasesResolver } from './graphql/resolvers/purchases.resolver';
import { PurchasesService } from 'src/services/purchases.service';
import { CustomerService } from 'src/services/customer.service';
import { CustomerResolver } from './graphql/resolvers/customer.resolver';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: path.resolve(process.cwd(), 'src', 'schema.gql'),
      driver: ApolloDriver,
    }),
  ],
  providers: [
    //resolvers
    ProductsResolver,
    CustomerResolver,
    PurchasesResolver,
    //services
    PurchasesService,
    ProductsService,
    CustomerService,
  ],
})
export class HttpModule {}
