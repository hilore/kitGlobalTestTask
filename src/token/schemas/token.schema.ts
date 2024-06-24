import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongo from 'mongoose';

export type TokenDocument = mongo.HydratedDocument<Token>;

@Schema()
export class Token {
  @Prop({ type: mongo.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ required: true })
  refreshToken: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
