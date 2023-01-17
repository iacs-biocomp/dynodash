import { Injectable } from '@nestjs/common';
import { UsersService } from '../models/users/users.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
  ) {}

  async validateUserByPass(username: string, pass: string): Promise<any> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(pass, saltOrRounds);
    const user = await this.usersService.findOne(username);

    const coinciden = await bcrypt.compare(user.password, hash);

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

}