import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UsersService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //
    const request = context.switchToHttp().getRequest();
    // 1) Getting token and check of it's there
    let token: any;
    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith('Bearer')
    ) {
      token = request.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedException('Invalid token or expired');
    }

    // 2) Verification token
    const decoded = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    // 3) Check if user still exists

    const currentUser = await this.userService.findById(decoded.id);

    if (!currentUser) {
      throw new UnauthorizedException(
        'The user belonging to this token no longer exists.',
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new UnauthorizedException(
        'User recently changed password! Please log in again.',
      );
    }

    request.user = currentUser;
    return true;
  }
}
