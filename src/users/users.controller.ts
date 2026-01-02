import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SigninDto } from './dtos/signin.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import express from 'express';
import { ResetUserPasswordDto } from './dtos/reset-password.dto';
import { UpdateUserPasswordDto } from './dtos/update-password.dto';
import { AuthGuard } from './auth/guards/auth.guard';
import { User } from './schemas/user.schema';
import { CurrentUser } from './auth/decorators/currentUser.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('api/v1/users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Serialize(UserDto)
  @Post('/signup')
  async signup(@Body() body: CreateUserDto) {
    const { user, token } = await this.authService.signup(body);
    return { ...user.toObject(), token };
  }

  @Serialize(UserDto)
  @Post('/login')
  async login(@Body() body: SigninDto) {
    const { user, token } = await this.authService.login(body);
    return { ...user.toObject(), token };
  }

  @Post('/forgotPassword')
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Req() req: express.Request,
  ) {
    const protocol = req.protocol;
    const host = req.get('host') as string;
    return await this.authService.forgotPassword(body, host, protocol);
  }

  @Serialize(UserDto)
  @Patch('/resetPassword/:tokenParam')
  async resetPassword(
    @Param('tokenParam') tokenParam: string,
    @Body() body: ResetUserPasswordDto,
  ) {
    return await this.authService.resetPassword(body, tokenParam);
  }

  @Patch('/updateMyPassword')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  async updatePassword(
    @CurrentUser() user: any,
    @Body() body: UpdateUserPasswordDto,
  ) {
    return await this.authService.updatePassword(user.id, body);
  }

  @Patch('/updateMe')
  @UseGuards(AuthGuard)
  @Serialize(UserDto)
  async updateMe(@CurrentUser() user: any, @Body() body: UpdateUserDto) {
    return await this.userService.updateMe(body, user.id);
  }
}
