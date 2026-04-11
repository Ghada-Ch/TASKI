import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../users/user.model';
import { Project } from '../projects/project.model';

@ObjectType()
export class Task {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  status: string;

  @Field()
  isCompleted: boolean;

  @Field()
  dueDate: Date;

  @Field()
  Priority: string;

  @Field()
  comments: string;

  @Field(() => User)
  createdBy: User;

  @Field(() => User, { nullable: true })
  assignedTo?: User;

  @Field(() => Project)
  project: Project;
}
