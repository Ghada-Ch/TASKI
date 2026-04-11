import { PrismaService } from '../prisma/prisma.service';
import { Project, Task } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(data: any, userId: string) {
    return this.prisma.project.create({
      data: {
        ...data,
        created_by: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: { tasks: true, user: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { tasks: true, user: true },
    });
  }

  async updateProgressAndStatus(projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { tasks: true },
    });

    if (!project) return null;

    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.isCompleted).length;
    const progressPercent =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // 📊 Progress logic
    let progressLabel = 'In Progress';
    if (progressPercent === 100) progressLabel = 'Completed';
    else if (new Date() > project.end_date && progressPercent < 100)
      progressLabel = 'Overdue';

    // 📈 Status logic
    const today = new Date();
    const totalDuration =
      project.end_date.getTime() - project.start_date.getTime();
    const elapsed =
      today.getTime() - project.start_date.getTime();
    const expectedProgress = Math.round((elapsed / totalDuration) * 100);

    let statusLabel = 'On Track';
    if (today <= project.end_date && progressPercent < expectedProgress * 0.5)
      statusLabel = 'At Risk';
    else if (today > project.end_date && progressPercent < 100)
      statusLabel = 'Off Track';

    return this.prisma.project.update({
      where: { id: projectId },
      data: {
        progress: `${progressPercent}% - ${progressLabel}`,
        status: statusLabel,
      },
    });
  }

  async updateProject(id: string, data: any) {
    const updated = await this.prisma.project.update({
      where: { id },
      data,
    });

    // Recalculate progress/status after any update
    await this.updateProgressAndStatus(id);
    return updated;
  }
}
