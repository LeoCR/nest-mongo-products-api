import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { encryptPassword } from '../auth/auth.util';

@Schema({
  timestamps: true,
})
export class User extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    minlength: 12,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

/* 
Middleware to encript the password before update
*/
UserSchema.pre('save', async function (next) {
  const user = this as User;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    user.password = await encryptPassword(user.password);
    next();
  } catch (error) {
    if (error instanceof Error) {
      next(error); // Manejando correctamente el error nativo de Mongoose
    } else {
      next(new Error('An unexpected error occurred'));
    }
  }
});
