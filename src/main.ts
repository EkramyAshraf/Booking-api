import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import morgan from 'morgan';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import mongoSanitizer from 'mongo-sanitizer';
import hpp from 'hpp';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(mongoSanitizer());
  app.use(
    hpp({
      whitelist: [
        'duration',
        'ratingsQuantity',
        'ratingsAverage',
        'maxGroupSize',
        'difficulty',
        'price',
      ],
    }),
  );
  app.use(cookieParser());
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  });
  app.use('/api', limiter);

  const configService = app.get(ConfigService);
  if (configService.get('NODE_ENV') === 'development') {
    app.use(morgan('dev'));
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
