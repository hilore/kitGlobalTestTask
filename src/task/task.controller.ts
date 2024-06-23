import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
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
  async createTask(@Body() dto: CreateTaskDto) {
    try {
      const {title, description} = dto;
      const task = await this.taskService.createTask(title, description);

      return task;
    } catch (err) {
      throw new ConflictException(err.message);
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
