import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserType } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserType>){}

  async findOne(username: string): Promise<User | undefined> {
    const existingUser = await this.userModel.findOne({ username }).exec()
    return existingUser;
  }
}
