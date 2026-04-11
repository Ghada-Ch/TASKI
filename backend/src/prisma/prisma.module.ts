import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // so we can inject PrismaService in any module without importing
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
