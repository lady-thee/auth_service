/* eslint-disable prettier/prettier */
import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClientHTTPResponse } from 'src/utils/interfaces/respose.interface';
import {  MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, LoginUserDto } from '@lady-thee/common-contracts';

const logger = new Logger('AuthService');

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @MessagePattern({
    cmd: 'create_user',
  })
  async handleCreateUser(
    @Payload() createUserDto: CreateUserDto,
  ): Promise<ClientHTTPResponse> {
    logger.log('Auth Service: Receieved create_user command with payload');
    return this.authService.createUserService(createUserDto);
  }

  @MessagePattern({
    cmd: 'login_user',
  })
  async handleLoginUser(
    @Payload() loginUserDto: LoginUserDto,
  ): Promise<ClientHTTPResponse> {
    logger.log('Auth Service: Receieved login command with payload');
    return this.authService.loginService(loginUserDto);
  }
}
