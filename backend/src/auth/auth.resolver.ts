import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginResponse } from './dto/login-response.model';
import { User } from '../users/user.model';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private usersService: UsersService, // inject UsersService
  ) {}

  @Mutation(() => LoginResponse)
async login(
  @Args('email') email: string,
  @Args('password') password: string,
): Promise<LoginResponse> {
  const { access_token, user } = await this.authService.validateUser(email, password);
 if (!user) throw new Error('User not found');
  return {
    access_token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      job: user.job,
      role: user.role,
    },
  };
}
}
