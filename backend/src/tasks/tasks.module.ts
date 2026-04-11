import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksResolver } from './tasks.resolver';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';

@Module({
  providers: [TasksResolver, TasksService, PrismaService, ProjectsService],
})
export class TasksModule {}
