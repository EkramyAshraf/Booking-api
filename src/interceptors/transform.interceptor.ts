import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const message = data.message;
        const token = data.token;
        const newData = { ...data };
        delete newData.token;
        delete newData.message;

        if (data.token) {
          return {
            status: 'success',
            token: token,
            data: newData,
          };
        } else {
          return {
            status: 'success',
            message: message,
            data: newData,
          };
        }
      }),
    );
  }
}
