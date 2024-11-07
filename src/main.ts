import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { appConfig } from './config/appConfig';
import { ExceptionHandlerFilter } from './filters/all-exceptionfilter';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = appConfig();
  if (process.env?.NODE_ENV?.trim() == 'development') {
    app.use(morgan('tiny'));
  }

  app.useGlobalFilters(new ExceptionHandlerFilter())
  await app.listen(config.port, config.host, () => {
    console.log('Server is running on port:', config.port);
  });
}
bootstrap();
