import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './project.model';
import { UpdateProjectInput } from './update-project.input';

@Resolver(() => Project)
export class ProjectsResolver {
  constructor(private projectsService: ProjectsService) {}

  @Query(() => [Project])
  async projects() {
    return this.projectsService.findAll();
  }

  @Mutation(() => Project)
  async createProject(
    @Args('name') name: string,
    @Args('description') description: string,
    @Args('start_date') start_date: string,
    @Args('end_date') end_date: string,
    @Context() context,
  ) {
    const user = context.req.user;
    if (!user?.sub) {
      throw new Error('Unauthorized: user not found in context');
    }

    return this.projectsService.createProject(
      {
        name,
        description,
        start_date: new Date(start_date),
        end_date: new Date(end_date),
      },
      user.sub,
    );
  }

  @Mutation(() => Project)
async updateProject(
  @Args('id') id: string,
  @Args('data') data: UpdateProjectInput,
) {
  return this.projectsService.updateProject(id, data);
}
}
