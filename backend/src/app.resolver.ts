import { Resolver, Query } from '@nestjs/graphql';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class HelloResponse {
  @Field()
  message: string;
}

@Resolver()
export class AppResolver {
  @Query(() => HelloResponse)
  hello() {
    return { message: 'Hello from NestJS GraphQL 🚀' };
  }
}
