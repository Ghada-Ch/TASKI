// src/users/users.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './user.model';
import { UpdateUserInput } from './update-user.input';
import * as bcrypt from 'bcrypt';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [User])
  async users() {
    return this.usersService.findAll();
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string) {
    return this.usersService.findById(id);
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args('job') job: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.createUser(email, hashedPassword, name, job);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UpdateUserInput,
  ) {
    return this.usersService.updateUser(id, data);
  }

  @Mutation(() => User)
  async updateUserPassword(
    @Args('id') id: string,
    @Args('password') password: string,
  ) {
    return this.usersService.updateUserPassword(id, password);
  }

  @Mutation(() => User)
  async changeUserPassword(
    @Args('id') id: string,
    @Args('currentPassword') currentPassword: string,
    @Args('newPassword') newPassword: string,
  ) {
    return this.usersService.changeUserPassword(id, currentPassword, newPassword);
  }
}



