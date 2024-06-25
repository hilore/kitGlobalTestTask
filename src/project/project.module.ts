import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TaskModule } from '../task/task.module';
import {AuthModule} from "../auth/auth.module";
import { TokenModule } from "../token/token.module"
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/project.schema';
import { ProjectController } from './project.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    AuthModule,
    TokenModule,
    TaskModule
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
