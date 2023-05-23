export class CreateUserDto {
  email: string;
  name: string;
  password: string;
  refreshToken?: string;
}

export class LoginUserDto {
  email: string;
  password: string;
}
