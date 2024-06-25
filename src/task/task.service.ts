import {
  forwardRef,
  Inject,
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import TaskDto from './dto/get.dto';
import {ProjectService} from "../project/project.service";
import {FilterTaskDto} from "./dto/filterTask.dto";

enum Status {
  Open = "OPEN",
  InProgress = "IN PROGRESS",
  Resolved = "RESOLVED"
};

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private model: Model<Task>,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService
  ) {}

  async createTask(
    userId: string,
    title: string,
    description: string,
  ): Promise<TaskDto> {
    const candidate = await this.findByTitle(title);
    if (candidate) {
      throw new ConflictException('Task with such title already exists');
    }

    const task = new this.model({
      title,
      description,
      status: Status.Open,
      user: userId,
    });
    await task.save();

    return new TaskDto(task);
  }

  async getTasks(filterTaskDto: FilterTaskDto): Promise<TaskDto[]> {
    let query;
    let taskIds: string[] = [];
    const tasksDto: TaskDto[] = [];
    let status = filterTaskDto.status;
    const {project, sortBy, sortOrder} = filterTaskDto;

    if (status) {
      status = status.toUpperCase();
    }

    if (project) {
      taskIds = await this.projectService.findTasksByProjectName(project);
      query = this.model.find({_id: {$in: taskIds}, ...(status && { status })});
    } else {
      query = this.model.find({...(status && { status })});
    }

    if (sortBy) {
      query.sort({[sortBy]: sortOrder === "ASC" ? 1 : -1});
    }

    const tasks: TaskDocument[] = await query.exec();

    tasks.forEach((task) => {
      tasksDto.push(new TaskDto(task));
    });

    return tasksDto;
  }

  async updateTask(
    id: string,
    title?: string,
    description?: string,
    status?: string,
  ): Promise<TaskDto> {
    const task = await this.model.findById(id);
    if (!task) {
      throw new NotFoundException(`Task such ID does not exists`);
    }

    if (title !== undefined) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }

    if (status !== undefined) {
      const newTaskStatus = Object.values(Status).find(s => s === status.toUpperCase());
      if (newTaskStatus === undefined) {
        throw new NotFoundException(`Status with title ${status} does not exists`);
      }

      task.status = newTaskStatus;
    }

    await task.save();

    return new TaskDto(task);
  }

  async findByTitle(title: string): Promise<TaskDto> {
    const task = await this.model.findOne({ title }).exec();
    if (!task) {
      return null;
    }

    return new TaskDto(task);
  }

  async findById(id: string): Promise<TaskDto> {
    const task = await this.model.findById(id).exec();
    if (!task) {
      throw new NotFoundException("Task with such ID does not exists");
    }

    return new TaskDto(task);
  }

  async deleteTask(id: string): Promise<object> {
    await this.model.findByIdAndDelete(id);
    return {};
  }
}
