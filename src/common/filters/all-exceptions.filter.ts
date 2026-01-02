import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private configService: ConfigService) {}

  catch(exception: any, host: ArgumentsHost) {
    const nodeEnv = this.configService.get<string>('NODE_ENV');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>() as any;

    //get basic status code
    let statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    //get basic message
    let message = exception.message || 'Something went very wrong!';

    if (nodeEnv === 'production') {
      //validation pipe errors
      if (exception instanceof BadRequestException) {
        let resBody = exception.getResponse() as any;
        message = Array.isArray(resBody.message)
          ? resBody.message.join('. ')
          : resBody.message;
      }

      if (exception.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${exception.path}: ${exception.value}.`;
      }

      if (exception.code === 11000) {
        statusCode = 400;
        const value = exception.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || '';
        message = `Duplicate field value: ${value}. Please use another value!`;
      }

      if (exception.name === 'JsonWebTokenError') {
        statusCode = 400;
        message = 'Invalid login, please login again!';
      }

      if (exception.name === 'TokenExpiredError') {
        statusCode = 400;
        message = 'your token has been Expired, please login again!';
      }
    }

    const status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    response.status(statusCode).json({
      status: status,
      message: message,
      // development
      ...(nodeEnv === 'development' && {
        error: exception,
        stack: exception.stack,
      }),
    });
  }
}
