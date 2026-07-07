import "reflect-metadata";
import helmet from "helmet";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({ origin: process.env.APP_URL, credentials: true });
  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle("mikroktic-manager API")
    .setDescription("Enterprise MikroTik NOC API")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app, config));

  await app.listen(process.env.PORT ? Number(process.env.PORT) : 4000);
}

bootstrap();
