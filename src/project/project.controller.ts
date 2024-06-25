import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Param,
  Body,
  UseGuards,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {AuthGuard} from "../auth/auth.guard";
import { ProjectService } from './project.service';
import { Request } from 'express';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import {AllExceptionsFilter} from "../exceptions/AllExceptionsFilter";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

interface UserRequest extends Request {
  userId: string;
}

@ApiTags('projects')
@UseGuards(AuthGuard)
@UseFilters(AllExceptionsFilter)
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({
    status: 200,
    description: 'The projects have been successfully retrieved',
  })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async getProjects() {
    const projects = await this.projectService.getAllProjects();
    return projects;
  }

  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully created',
  })
  @ApiResponse({ status: 409, description: 'The project already exists' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async createProject(@Body() dto: CreateProjectDto, @Req() req: UserRequest) {
    const project = await this.projectService.createProject(
      dto.name,
      req.userId,
    );

    return project;
  }

  @ApiBearerAuth()
  @Put(':id')
  @ApiOperation({ summary: 'Add task to a project' })
  @ApiResponse({
    status: 200,
    description: 'The task has been successfully added to a project',
  })
  @ApiResponse({ status: 404, description: 'The task not found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  async updateProject(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    const project = await this.projectService.addTask(
      id,
      dto.taskId
    );

    return project;
  }
}
