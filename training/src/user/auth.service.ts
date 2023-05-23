import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    public configService: ConfigService,
  ) {}

  async register(userDto: CreateUserDto) {
    try {
      const user = await this.userService.create(userDto);

      return user;
    } catch (error) {
      const { status } = error;
      if (status === 400) {
        throw new HttpException('Email exsist', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userService.findByLogin(loginUserDto);
    const token = await this.signJwtToken(user);

    return {
      email: user.email,
      ...token,
    };
  }

  async validateUser(email) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private async signJwtToken({ email }, refresh = true) {
    const accessToken = await this.jwtService.signAsync(
      { email },
      {
        expiresIn: this.configService.get('EXPIRESIN'),
        secret: this.configService.get('SECRET_KEY'),
      },
    );
    if (refresh) {
      const refreshToken = await this.jwtService.signAsync(
        { email },
        {
          secret: this.configService.get('SECRETKEY_REFRESH'),
          expiresIn: this.configService.get('EXPIRESIN_REFRESH'),
        },
      );

      const user = await this.userService.update(
        { email: email },
        {
          refreshToken: refreshToken,
        },
      );
      console.log(user);
      return {
        expiresIn: this.configService.get('EXPIRESIN'),
        accessToken,
        refreshToken,
        expiresInRefresh: this.configService.get('EXPIRESIN_REFRESH'),
      };
    } else {
      return {
        expiresIn: this.configService.get('EXPIRESIN'),
        accessToken,
      };
    }
  }

  async refresh(refresh_token) {
    try {
      const payload = await this.jwtService.verify(refresh_token, {
        secret: this.configService.get('SECRETKEY_REFRESH'),
      });

      const user = await this.userService.getUserByRefresh(
        refresh_token,
        payload.email,
      );

      const token = await this.signJwtToken(user, false);
      return {
        email: user.email,
        ...token,
      };
    } catch (e) {
      console.log(e);
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}
