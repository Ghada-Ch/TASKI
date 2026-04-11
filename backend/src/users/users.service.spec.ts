import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('changeUserPassword', () => {
    it('should throw error if user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.changeUserPassword('invalid-id', 'currentPass', 'newPass'),
      ).rejects.toThrow('User not found');
    });

    it('should throw error if current password is incorrect', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-old-password',
        name: 'Test User',
        role: 'user',
        job: 'Developer',
        createdAt: new Date(),
      };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.changeUserPassword('user-1', 'wrongPassword', 'newPassword'),
      ).rejects.toThrow('Current password is incorrect');
    });

    it('should update password if current password is correct', async () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-old-password',
        name: 'Test User',
        role: 'user',
        job: 'Developer',
        createdAt: new Date(),
      };

      const updatedUser = { ...mockUser, password: 'hashed-new-password' };

      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed-new-password' as never);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(updatedUser);

      const result = await service.changeUserPassword(
        'user-1',
        'correctPassword',
        'newPassword',
      );

      expect(result).toEqual(updatedUser);
      expect(bcrypt.compare).toHaveBeenCalledWith('correctPassword', 'hashed-old-password');
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { password: 'hashed-new-password' },
      });
    });
  });
});
