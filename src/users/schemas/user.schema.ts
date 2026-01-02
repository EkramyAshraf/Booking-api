import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import bcrypt from 'node_modules/bcryptjs';
import validator from 'validator';
import crypto from 'crypto';
export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    lowercase: true,
    unique: true,
    validate: [validator.isEmail],
  })
  email: string;

  @Prop()
  photo: string;

  @Prop({ required: true, minLength: 8, select: false })
  password: string;

  @Prop({
    required: true,
    minLength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not the same',
    },
    select: false,
  })
  passwordConfirm?: string;

  @Prop()
  passwordChangedAt: Date;

  @Prop({ enum: ['admin', 'user', 'lead-guide', 'guide'], default: 'user' })
  role: string;

  @Prop({ type: String })
  passwordResetToken: string | undefined;

  @Prop({ type: Date })
  passwordResetExpires: Date | undefined;

  changedPasswordAfter: (jwtTimestamp: number) => boolean;
  createPasswordResetToken: () => string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (this: UserDocument) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) {
    return;
  }

  //hash the password with cost 12
  this.password = await bcrypt.hash(this.password, 12);
  //delete passwordConfirm
  this.passwordConfirm = undefined;
});

UserSchema.methods.changedPasswordAfter = function (jwtTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );

    return jwtTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

UserSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
