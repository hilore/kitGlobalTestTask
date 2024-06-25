import {
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';
import { TaskService } from '../task/task.service';
import ProjectDto from './dto/project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private readonly taskService: TaskService,
  ) {}

  async createProject(name: string, userId: string): Promise<ProjectDto> {
    const candidate = await this.projectModel.findOne({ name });
    if (candidate) {
      throw new ConflictException(`Project with such name already exists`);
    }

    const project = new this.projectModel({ name, user: userId });
    await project.save();

    return new ProjectDto(project);
  }

  async getAllProjects(): Promise<ProjectDto[]> {
    const projectsDto: ProjectDto[] = [];
    const projects = await this.projectModel.find();
    for (const prj of projects) {
      projectsDto.push(new ProjectDto(prj));
    }

    return projectsDto;
  }

  async findTasksByProjectName(name: string): Promise<string[]> {
    const project = await this.projectModel.findOne({name});
    if (!project) {
      throw new NotFoundException("Project with such name does not exists");
    }

    return project ? project.tasks.map(taskId => taskId.toString()) : [];
  }

  async addTask(id: string, taskId: string): Promise<ProjectDto> {
    const project = await this.projectModel.findById(id);
    if (!project) {
      throw new NotFoundException('Project with such ID does not exists');
    }

    const task = await this.taskService.findById(taskId);
    if (!task) {
      throw new NotFoundException('Task with such ID does not exists');
    }

    if (!project.tasks.includes(task.id)) {
      project.tasks.push(task.id);
      await project.save();
    }

    return new ProjectDto(project);
  }
}
