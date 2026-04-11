import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectsService } from '../projects/projects.service';
import { UpdateTaskInput } from './update-task.input';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private projectsService: ProjectsService,
  ) {}

  async createTask(data: any) {
    const task = await this.prisma.task.create({
      data: {
        ...data,
      },
    });

    await this.projectsService.updateProgressAndStatus(task.projectId);
    return task;
  }

  async updateTask(id: string, data: Partial<UpdateTaskInput>) {
  return this.prisma.task.update({
    where: { id },
    data,
  });
}

  async findAll() {
    return this.prisma.task.findMany({
      include: { createdBy: true, assignedTo: true, project: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
      include: { createdBy: true, assignedTo: true, project: true },
    });
  }
}
