import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import {ProjectService} from "./project.service";
import {Request} from "express";
import {CreateProjectDto} from "./dto/createProject.dto";
import {UpdateProjectDto} from "./dto/updateProject.dto";

interface UserRequest extends Request {
  userId: string;
};

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async getProjects() {
    try {
      const projects = await this.projectService.getAllProjects();
      return projects;
    } catch (err) {
      console.error(`Failed to retrieve projects:`, err);
      throw new InternalServerErrorException();
    }
  }

  @UsePipes(new ValidationPipe())
  @Post()
  async createProject(@Body() dto: CreateProjectDto, @Req() req: UserRequest) {
    try {
      const project = await this.projectService.createProject(dto.name, req.userId);
      return project;
    } catch (err) {
      if (err instanceof Error) {
        throw new ConflictException(err.message);
      }

      console.error("Failed to create project:", err);
      throw new InternalServerErrorException();
    }
  }

  @Put(":id")
  async updateProject(@Param("id") id: string, @Body() dto: UpdateProjectDto) {
    if (id.length != 24) {
      throw new BadRequestException("Project ID must be exactly 24 characters long");
    }

    try {
      const project = await this.projectService.addTask(id, dto.taskId);
      return project;
    } catch (err) {
      if (err instanceof Error) {
        throw new NotFoundException(err.message);
      }

      console.error(`Failed to add task ${dto.taskId} to a project ${id}:`, err);
      throw new InternalServerErrorException();
    }
  }
}
