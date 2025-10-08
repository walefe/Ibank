import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/filter/http-exception.filter';
import { ConfigService } from './shared/module/config/service/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter(new ConfigService()));
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('Ibank')
    .setDescription('A simple api')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  app.use('/reference', apiReference({ content: documentFactory }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
