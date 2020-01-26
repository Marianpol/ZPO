import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findUser(username);
    console.log(user);
    if (user && user[0].password === pass) {
      const { password, ...result } = user[0];
      return result;
    }
    return null;
  }
}