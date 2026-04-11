import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProjectsService } from './projects.service';
import { ProjectsResolver } from './projects.resolver';

@Module({
  imports: [PrismaModule],
  providers: [ProjectsService, ProjectsResolver],
})
export class ProjectsModule {}
