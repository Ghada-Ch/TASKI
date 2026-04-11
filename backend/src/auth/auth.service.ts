import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<{ access_token: string; user: any }> {
  const user = await this.usersService.findByEmail(email);
  if (!user) throw new UnauthorizedException('User not found');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new UnauthorizedException('Invalid password');

  const payload = { sub: user.id, email: user.email,role: user.role };
  console.log('payload:', payload);
  return {
    access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
    user,
 };
 
 }
}
