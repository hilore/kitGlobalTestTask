import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema()
export class Task {
  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: String, ref: 'Status' })
  status: string;

  @Prop({ type: String, ref: 'User' })
  user: string;

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
