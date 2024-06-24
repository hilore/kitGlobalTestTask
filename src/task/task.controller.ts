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
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create.dto';
import { UpdateTaskDto } from './dto/update.dto';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

interface UserRequest extends Request {
  userId: string;
}

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({
    status: 200,
    description: 'The tasks have been successfully retrieved',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getTasks() {
    try {
      const tasks = await this.taskService.getAllTasks();
      return tasks;
    } catch (err) {
      console.error('Failed to retrieve tasks:', err);
      throw new InternalServerErrorException();
    }
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Get a specific task by ID' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully retrieved',
  })
  @ApiResponse({ status: 404, description: 'The task not found' })
  async getTask(@Param('id') id: string) {
    const task = await this.taskService.findById(id);
    if (!task) {
      throw new NotFoundException('Task with such title does not exists');
    }

    return task;
  }

  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'The task has been successfully created',
  })
  @ApiResponse({ status: 409, description: 'The task already exists' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createTask(@Body() dto: CreateTaskDto, @Req() req: UserRequest) {
    try {
      const { title, description } = dto;
      const task = await this.taskService.createTask(
        req.userId,
        title,
        description,
      );

      return task;
    } catch (err) {
      if (err instanceof Error) {
        throw new ConflictException(err.message);
      }

      console.error('Failed to create task:', err);
      throw new InternalServerErrorException();
    }
  }

  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @Put(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'The task not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateTask(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    if (id.length != 24) {
      throw new BadRequestException(
        'Task ID must be exactly 24 characters long',
      );
    }

    try {
      const { title, description, status } = dto;
      if (
        title === undefined &&
        description === undefined &&
        status === undefined
      ) {
        const task = await this.taskService.findById(id);
        return task;
      }

      const task = await this.taskService.updateTask(
        id,
        title,
        description,
        status,
      );

      return task;
    } catch (err) {
      if (err instanceof Error) {
        throw new NotFoundException(err.message);
      }

      console.error(`Failed to update task with ID ${id}:`, err);
      throw new InternalServerErrorException();
    }
  }

  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @Delete(':id')
  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully deleted',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async deleteTask(@Param('id') id: string) {
    if (id.length != 24) {
      throw new BadRequestException('ID must be exactly 24 characters long');
    }

    try {
      const res = await this.taskService.deleteTask(id);
      return res;
    } catch (err) {
      console.error(`Failed to delete task by ${id} ID:`, err);
      throw new InternalServerErrorException();
    }
  }
}
