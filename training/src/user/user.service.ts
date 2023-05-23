import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

import * as bcrypt from 'bcrypt';
import { CreateUserDto, LoginUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  async create(userDto: CreateUserDto): Promise<any> {
    const salt = bcrypt.genSaltSync(10);
    userDto.password = await bcrypt.hashSync(userDto.password, salt);
    const userInDb = await this.userRepository.findByCondition({
      email: userDto.email,
    });
    if (userInDb) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    userDto.refreshToken = null;
    return await this.userRepository.create(userDto);
  }
  async findByLogin({ email, password }: LoginUserDto): Promise<any> {
    const user = await this.userRepository.findByCondition({
      email: email,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }
    const is_equal = bcrypt.compareSync(password, user.password);
    if (!is_equal) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
  async findByEmail(email: string): Promise<any> {
    return await this.userRepository.findByCondition({
      email: email,
    });
  }

  async update(filter, update) {
    const salt = bcrypt.genSaltSync(10);
    if (update.refreshToken) {
      update.refreshToken = await bcrypt.hash(
        this.reverse(update.refreshToken),
        salt,
      );
    }
    return await this.userRepository.findByConditionAndUpdate(filter, update);
  }

  async getUserByRefresh(refresh_token, email) {
    // console.log(refresh_token, email);
    const user = await this.findByEmail(email);
    console.log(user);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    const is_equal = await bcrypt.compare(
      this.reverse(refresh_token),
      user.refreshToken,
    );

    if (!is_equal) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  private reverse(s) {
    return s.split('').reverse().join('');
  }
}
