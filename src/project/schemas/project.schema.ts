import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mg from "mongoose";

export type ProjectDocument = mg.HydratedDocument<Project>;

@Schema()
export class Project {
  @Prop({required: true, unique: true})
  name: string;

  @Prop({type: [{type: mg.Schema.Types.ObjectId, ref: "Task"}], default: []})
  tasks: string[];

  @Prop({type: String, ref: "User"})
  user: string;

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
