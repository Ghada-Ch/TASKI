import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
  return this.prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, role: true, name: true, job:true },
  })
}

  async createUser(email: string, password: string, name: string,job: string, role: string = "user") 
  {
  return this.prisma.user.create({
    data: {
      email,
      password,
      name,
      job,
      role,
    },
  });
}

  async findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, job: true, role: true },
    });
  }

  async updateUser(id: string, data: { name?: string; job?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateUserPassword(id: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async changeUserPassword(id: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error("User not found");
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
}

