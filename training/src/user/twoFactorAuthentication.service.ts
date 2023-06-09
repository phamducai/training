import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import { User } from './user.model';
@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async pipeQrCodeStream(stream: Response, otpAuthUrl: string) {
    return toFileStream(stream, otpAuthUrl);
  }
  async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      user.email,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );
    //cap nhat sercet

    await this.userService.setTwoFactorAuthenticationSecret(secret, user._id);
    return {
      secret,
      otpAuthUrl,
    };
  }

  async isTwoFactorAuthenticationCodeValid(code, user) {
    return authenticator.verify({
      token: code,
      secret: user.twoFactorAuthenticationSecret,
    });
  }
}
