import { ObjectType, Field } from '@nestjs/graphql';
import { Task } from '../tasks/task.model';

@ObjectType()
export class Project {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  start_date: Date;

  @Field()
  end_date: Date;

  @Field()
  progress: string;

  @Field()
  status: string;

  @Field()
  comments: string;

  @Field()
  created_at: Date;

  @Field()
  created_by: string;

  @Field(() => [Task], { nullable: true })
  tasks?: Task[];
}
