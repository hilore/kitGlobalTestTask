import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  BadRequestException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import {TaskService} from "./task.service";
import {CreateTaskDto} from "./dto/create.dto";
import {DeleteTaskDto} from "./dto/delete.dto";
import {UpdateTaskDto} from "./dto/update.dto";
import {Request} from "express";

interface UserRequest extends Request {
  userId: string;
}

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get()
  async getTasks() {
    const tasks = await this.taskService.getAllTasks();
    return tasks;
  }

  @Get(":id")
  async getTask(@Param("id") id: string) {
    const task = await this.taskService.findById(id);
    if (!task) {
      throw new NotFoundException("Task with such title does not exists");
    }

    return task;
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createTask(@Body() dto: CreateTaskDto, @Req() req: UserRequest) {
    try {
      const {title, description} = dto;
      const task = await this.taskService.createTask(req.userId, title, description);

      return task;
    } catch (err) {
      throw new ConflictException(err.message);
    }
  }

  @UsePipes(new ValidationPipe())
  @Put(":id")
  async updateTask(@Param("id") id: string, @Body() dto: UpdateTaskDto) {
    if (id.length != 24) {
      throw new BadRequestException("Task ID must be exactly 24 characters long");
    }

    try {
      const {title, description, status} = dto;
      if (title === undefined && description === undefined && status === undefined) {
        const task = await this.taskService.findById(id);
        return task;
      }

      const task = await this.taskService.updateTask(id, title, description, status);

      return task;
    } catch (err) {
      if (err instanceof Error) {
        throw new NotFoundException(err.message);
      }

      console.error(`Failed to update task with ID ${id}:`, err);
      throw new InternalServerErrorException();
    }
  }

  @UsePipes(new ValidationPipe())
  @Delete()
  async deleteTask(@Body() dto: DeleteTaskDto) {
    if ("id" in dto && Object.keys(dto).length > 1) {
      throw new BadRequestException("Only ID must be specified");
    }

    try {
      const res = await this.taskService.deleteTask(dto.id);
      return res;
    } catch (err) {
      console.error(`Failed to delete task by ${dto.id} ID:`, err);
      throw new InternalServerErrorException();
    }
  }
}
