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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { SigninDto } from './dtos/signin.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { Request, Response } from 'express';
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
import { LogoutInterceptor } from 'src/interceptors/logout.interceptor';
import { SharpPipe } from 'src/pipes/sharp.pipe';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('api/v1/users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('/signup')
  @HttpCode(201)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }], {
      storage: memoryStorage(),
    }),
  )
  @UseInterceptors(SetCookieInterceptor)
  @Serialize(UserDto)
  async signup(
    @UploadedFiles(SharpPipe) imageNames: any,
    @Body() body: CreateUserDto,
  ) {
    if (imageNames.photo) body.photo = imageNames.photo;
    return await this.authService.signup(body);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SetCookieInterceptor)
  @Serialize(UserDto)
  async login(@Body() body: SigninDto) {
    return await this.authService.login(body);
  }

  @Post('/forgotPassword')
  @HttpCode(201)
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Req() req: express.Request,
  ) {
    const protocol = req.protocol;
    const host = req.get('host') as string;
    return await this.authService.forgotPassword(body, host, protocol);
  }

  @Patch('/resetPassword/:tokenParam')
  @UseInterceptors(SetCookieInterceptor)
  @Serialize(UserDto)
  async resetPassword(
    @Param('tokenParam') tokenParam: string,
    @Body() body: ResetUserPasswordDto,
  ) {
    return await this.authService.resetPassword(body, tokenParam);
  }

  @Patch('/updateMyPassword')
  @Roles('user')
  @UseGuards(AuthGuard, RoleGuards)
  @UseInterceptors(SetCookieInterceptor)
  @Serialize(UserDto)
  async updatePassword(
    @CurrentUser() user: any,
    @Body() body: UpdateUserPasswordDto,
  ) {
    return await this.authService.updatePassword(user.id, body);
  }

  @Patch('/updateMe')
  @Roles('admin', 'user')
  @UseGuards(AuthGuard, RoleGuards)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }], {
      storage: memoryStorage(),
    }),
  )
  @Serialize(UserDto)
  async updateMe(
    @UploadedFiles(SharpPipe) imageNames: any,
    @CurrentUser() user: any,
    @Body() body: UpdateUserDto,
  ) {
    if (imageNames.photo) body.photo = imageNames.photo;
    return await this.userService.updateMe(body, user.id);
  }

  @UseGuards(AuthGuard)
  @Delete('/deleteMe')
  @HttpCode(204)
  async deleteMe(@CurrentUser() user: any) {
    return await this.userService.deleteMe(user.id);
  }

  @Roles('admin')
  @UseGuards(AuthGuard, RoleGuards)
  @Get('/')
  @Serialize(UserDto)
  async getAllUsers() {
    const users = await this.userService.find();
    return {
      users,
    };
  }

  @Roles('admin', 'user')
  @UseGuards(AuthGuard, RoleGuards)
  @Get('/me')
  @Serialize(UserDto)
  async getMe(@CurrentUser() user: any) {
    return user;
  }

  @Get('/logout')
  @UseInterceptors(LogoutInterceptor)
  async logout() {
    return await this.authService.logout();
  }
}
