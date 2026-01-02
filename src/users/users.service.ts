import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';
import { SigninDto } from './dtos/signin.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  @InjectModel(User.name) private userModel: Model<UserDocument>;

  async createUser(dto: CreateUserDto) {
    return this.userModel.create(dto);
  }

  async findOne(dto: SigninDto) {
    return await this.userModel
      .findOne({ email: dto.email })
      .select('+password');
  }

  async findForResetPassword(hashedToken: string) {
    return await this.userModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findById(id: string) {
    return await this.userModel.findById(id).select('+password');
  }

  async updateMe(dto: UpdateUserDto, id: string) {
    // 3) Update user document
    const user = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });

    return {
      ...user?.toObject(),
    };
  }
}
