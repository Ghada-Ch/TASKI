import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],  // allows UsersService to use Prisma
  providers: [UsersService, UsersResolver],
  exports: [UsersService],   // so AuthService can inject UsersService
})
export class UsersModule {}

