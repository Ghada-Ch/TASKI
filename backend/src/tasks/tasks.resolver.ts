import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { UpdateTaskInput } from './update-task.input';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private tasksService: TasksService) {}

  @Query(() => [Task])
  async tasks() {
    return this.tasksService.findAll();
  }

  @Mutation(() => Task)
  async createTask(
    @Args('title') title: string,
    @Args('description') description: string,
    @Args('projectId') projectId: string,
    @Args('assignedToId') assignedToId: string,
    @Args('dueDate') dueDate: string,
    @Args('Priority') Priority: string,
    @Context() context,
  ) {
    const user = context.req.user;
    if (!user?.sub) {
      throw new Error('Unauthorized: user not found in context');
    }

    return this.tasksService.createTask({
      title,
      description,
      dueDate: new Date(dueDate),
      Priority,
      assignedToId,
      projectId,
      createdById: user.sub,
    });
  }

  @Mutation(() => Task)
async updateTask(
  @Args('id') id: string,
  @Args('data') data: UpdateTaskInput,
) {
  return this.tasksService.updateTask(id, data);
}
}
