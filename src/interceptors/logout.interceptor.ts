import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LogoutInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        const res = context.switchToHttp().getResponse();

        res.cookie('jwt', 'LoggedOut', {
          httpOnly: true,
          expires: new Date(Date.now() + 10 * 1000),
          secure: this.configService.get('NODE_ENV') === 'production',
        });

        return data;
      }),
    );
  }
}
