import { Injectable } from '@nestjs/common';
import {Model} from "mongoose";
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private model: Model<Task>) {}

  async createTask(title: string, description: string): Promise<Task> {
    const candidate = await this.getTask(title);
    if (candidate) {
      throw new Error("Task with such title already exists");
    }

    const task = new this.model({title, description});
    return task.save();
  }

  async getAllTasks(): Promise<Task[]> {
    return this.model.find().exec();
  }

  async getTask(title: string): Promise<Task> {
    return this.model.findOne({title}).exec();
  }
}
