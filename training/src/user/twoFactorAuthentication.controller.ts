import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { TwoFactorAuthenticationService } from './twoFactorAuthentication.service';
import { AuthGuard } from '@nestjs/passport';
@Controller('2fa')
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
    private userService: UserService,
    private authService: AuthService,
  ) {}
  @Post('generate')
  @UseGuards(AuthGuard('jwt'))
  async generate(@Res() response: any, @Req() request: any) {
    console.log(request.user);

    const { otpAuthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(
        request.user,
      );
    console.log(otpAuthUrl);
    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpAuthUrl,
    );
  }

  @Post('authenticate')
  @UseGuards(AuthGuard('jwt'))
  async authentication(@Req() request: any, @Body('code') code) {
    console.log(code);
    const isCodeValid =
      await this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
        code,
        request.user,
      );
    console.log(code, isCodeValid);
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return this.authService.getAccess2FA(request.user);
  }
  @Post('turn-on')
  @HttpCode(200)
  @UseGuards(AuthGuard('jwt'))
  async turnOnTwoFactorAuthentication(@Req() request: any) {
    await this.userService.turnOnTwoFactorAuthentication(request.user._id);
  }
}
