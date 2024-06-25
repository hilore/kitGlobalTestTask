import { Module, forwardRef} from '@nestjs/common';
import {AuthModule} from "../auth/auth.module";
import {ProjectModule} from "../project/project.module";
import { TokenModule } from "../token/token.module"
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schemas/task.schema';
import { TaskController } from './task.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
    ]),
    AuthModule,
    TokenModule,
    forwardRef(() => ProjectModule)
  ],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
