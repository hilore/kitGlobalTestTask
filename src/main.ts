import { NestFactory } from '@nestjs/core';
import {SwaggerModule, DocumentBuilder} from "@nestjs/swagger";
import { AppModule } from './app.module';

async function bootstrap() {
  const port = parseInt(process.env.BACKEND_PORT, 10) || 4000;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("KGlobal Test Task")
    .setDescription("The project/task API description")
    .setVersion("1.0")
    .addTag("tasks")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(port);
}
bootstrap();
