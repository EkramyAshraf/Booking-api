import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../dtos/create-user.dto';
import { SigninDto } from '../dtos/signin.dto';
import * as bcrypt from 'bcryptjs';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { MailService } from 'src/mail/mail.service';
import * as crypto from 'crypto';
import { ResetUserPasswordDto } from '../dtos/reset-password.dto';
import { UpdateUserPasswordDto } from '../dtos/update-password.dto';
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signup(dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);
    const token = await this.jwtService.signAsync({ id: user._id });

    return {
      ...user.toObject(),
      token,
    };
  }

  async login(dto: SigninDto) {
    const { password } = dto;
    const user = await this.userService.findOne(dto);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Incorrect email or password');
    }
    const token = await this.jwtService.signAsync({ id: user._id });
    return { ...user.toObject(), token };
  }

  async forgotPassword(dto: ForgotPasswordDto, host: string, protocol: string) {
    // 1) Get user based on POSTed email
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      throw new NotFoundException('No user found with this email');
    }

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${protocol}://${host}/api/v1/users/resetPassword/${resetToken}`;

    try {
      await this.mailService.sendPasswordReset(user, resetURL);
      return {
        status: 'success',
        message: 'Token sent to email!',
      };
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      throw new InternalServerErrorException(
        'There was an error sending the email. Try again later!',
      );
    }
  }

  async resetPassword(dto: ResetUserPasswordDto, tokenParam: string) {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(tokenParam)
      .digest('hex');

    const user = await this.userService.findForResetPassword(hashedToken);

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      throw new BadRequestException('Token is invalid or has expired');
    }
    user.password = dto.password;
    user.passwordConfirm = dto.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    const token = await this.jwtService.signAsync({ id: user._id });

    return {
      status: 'success',
      token,
      data: {
        user,
      },
    };
  }

  async updatePassword(id: string, dto: UpdateUserPasswordDto) {
    // 1) Get user from collection
    const user = (await this.userService.findById(id)) as any;

    // 2) Check if POSTed current password is correct
    if (!(await bcrypt.compare(dto.currentPassword, user.password))) {
      throw new UnauthorizedException('Your current password is wrong.');
    }

    // 3) If so, update password
    user.password = dto.newPassword;
    user.passwordConfirm = dto.passwordConfirm;
    await user.save();

    // 4) Log user in, send JWT
    const token = await this.jwtService.signAsync({ id: user._id });

    return {
      ...user.toObject(),
      token,
    };
  }

  async logout() {
    return { status: 'success' };
  }
}
