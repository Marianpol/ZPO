import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findUser(username);
    if (user && user[0].password === pass) {
      const { password, ...result } = user[0];
      return result;
    }
    throw new UnauthorizedException();
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}