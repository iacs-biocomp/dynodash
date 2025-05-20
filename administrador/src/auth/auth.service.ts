import { Injectable } from '@nestjs/common';
import { UsersService } from '../models/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async validateUserByPass(username: string, pass: string): Promise<any> {
    let response = null
    const user = await this.usersService.findOne(username);
    if (user) {
      const coinciden = await bcrypt.compare(pass, user.password);
      if (coinciden) {
        const { password, ...result } = user;
        response = result
      }
    }
    return response;
  }
}
