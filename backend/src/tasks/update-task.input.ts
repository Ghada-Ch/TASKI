import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateTaskInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  isCompleted?: boolean;

  @Field({ nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  priority?: string;

  @Field({ nullable: true })
  comments?: string;
}