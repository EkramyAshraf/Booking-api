import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
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

import { User } from './schemas/user.schema';
import { CurrentUser } from './auth/decorators/currentUser.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { SetCookieInterceptor } from 'src/interceptors/set-cookie.interceptor';
import { Roles } from '../users/auth/decorators/roles.decorator';
import { RoleGuards } from '../guards/roles.guard';
import { AuthGuard } from '../guards/auth.guard';

@Controller('api/v1/users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseInterceptors(SetCookieInterceptor)
  @Serialize(UserDto)
  @Post('/signup')
  async signup(@Body() body: CreateUserDto) {
    const { user, token } = await this.authService.signup(body);
    return { ...user.toObject(), token };
  }

  @UseInterceptors(SetCookieInterceptor)
  @Serialize(UserDto)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
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

  @Delete('/deleteMe')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteMe(@CurrentUser() user: any) {
    return await this.userService.deleteMe(user.id);
  }

  @Get('/')
  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuards)
  @UseGuards(AuthGuard)
  async getAllUsers() {
    const users = await this.userService.find();
    return {
      users,
    };
  }
}
