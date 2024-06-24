import {ProjectDocument} from "../schemas/project.schema";

class ProjectDto {
  id: string;
  name: string;
  userId: string;
  tasks: string[];
  createdAt: number;

  constructor(project: ProjectDocument) {
    this.id = project.id;
    this.name = project.name;
    this.userId = project.user;
    this.tasks = project.tasks;
    this.createdAt = new Date(project.createdAt).getTime();
  }
}

export default ProjectDto;
