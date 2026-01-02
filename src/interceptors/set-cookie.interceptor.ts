import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map } from 'rxjs/operators';

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse();

        if (data && data.token) {
          res.cookie('jwt', data.token, {
            httpOnly: true,
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            secure: this.configService.get('NODE_ENV') === 'production',
          });
        }
        return data;
      }),
    );
  }
}
