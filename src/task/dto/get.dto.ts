import {TaskDocument} from "../schemas/task.schema";

class TaskDto {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: number;

  constructor(task: TaskDocument) {
    this.id = task._id.toString();
    this.title = task.title;
    this.description = task.description;
    this.status = task.status;
    this.createdAt = new Date(task.createdAt).getTime();
  }
}

export default TaskDto;
