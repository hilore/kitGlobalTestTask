import { Injectable } from '@nestjs/common';
import {Model} from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import {Status} from "./schemas/status.schema";
import TaskDto from "./dto/get.dto";

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private model: Model<Task>,
    @InjectModel(Status.name) private statusModel: Model<Status>
  ) {}

  async createTask(title: string, description: string): Promise<TaskDto> {
    const candidate = await this.findByTitle(title);
    if (candidate) {
      throw new Error("Task with such title already exists");
    }

    const status = await this.statusModel.findOne({title: "OPEN"});
    const task = new this.model({title, description, status: status.title});
    await task.save();

    return new TaskDto(task);
  }

  async getAllTasks(): Promise<TaskDto[]> {
    const tasksDto: TaskDto[] = [];
    const tasks = await this.model.find().exec();

    tasks.forEach(task => {
      tasksDto.push(new TaskDto(task));
    });

    return tasksDto;
  }

  async findByTitle(title: string): Promise<TaskDto> {
    const task = await this.model.findOne({title}).exec();
    if (!task) {
      return null;
    }

    return new TaskDto(task);
  }

  async findById(id: string): Promise<TaskDto> {
    const task = await this.model.findById(id).exec();
    if (!task) {
      return null;
    }

    return new TaskDto(task);
  }

  async deleteTask(id: string): Promise<object> {
    await this.model.findByIdAndDelete(id);
    return {};
  }
}
