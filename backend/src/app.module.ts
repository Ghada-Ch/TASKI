import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import * as jwt from 'jsonwebtoken';
import { AppResolver } from './app.resolver';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './tasks/tasks.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      sortSchema: true,
      context: ({ req }) => {
        const token = req.headers.authorization?.split(' ')[1];
        const secret = process.env.JWT_SECRET;

        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }

        if (token) {
      try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
      } catch (err) {
        console.warn('Invalid token');
      }
    }

        return { req };
      },
    }),
    UsersModule,
    AuthModule,
    ProjectsModule,
    TasksModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
