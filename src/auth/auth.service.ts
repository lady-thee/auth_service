/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/register.dto';
import { get_response, StatusCode } from 'src/utils/response.helpers';
import { ServerHTTPResponse } from 'src/utils/interfaces/respose.interface';
import { PasswordUtils } from 'src/utils/password.utils';
import { JWTUtilService } from 'src/utils/jwt.utils';
import { LoginUserDto } from './dto/login.dto';
import { Prisma } from 'generated/prisma';
import { addHours } from 'date-fns';
import { PrismaService } from 'src/prisma/prisma.service';

const logger = new Logger('AuthService');

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JWTUtilService,
  ) {}

  async createUserService(
    createUserDto: CreateUserDto,
  ): Promise<ServerHTTPResponse> {
    const { email, password, ...data } = createUserDto;

    try {
      // Check if email or password is missing from payload
      if (!email || !password) {
        logger.warn('Create user attempt with missing email or password');
        return get_response(
          StatusCode.BadRequest,
          'Email or password missing from payload',
        );
      }

      // Check if email is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        logger.warn(`Invalid email format attempted: ${email}`);
        return get_response(StatusCode.BadRequest, 'Invalid email format.');
      }

      // Check if user exists
      const existingUser = await this.prisma.user.findFirst({
        where: { email },
      });

      if (existingUser) {
        logger.warn(`User creation attempted with existing email: ${email}`);
        return get_response(
          StatusCode.BadRequest,
          'User with email address already exists',
        );
      }

      const hashedPassword = await PasswordUtils.hashPassword(password);

      // Create user logic
      const response = await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: email,
            password: hashedPassword,
            ...data,
          },
        });
        logger.log(`User successfully created with email: ${email}`);
        return get_response(
          StatusCode.Created,
          'User successfully created',
          user,
        );
      });

      return response;
    } catch (error) {
      logger.error(`Error creating user: ${error}`, error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors
        return get_response(
          StatusCode.InternalServerError,
          'Database error occurred while creating user',
        );
      }

      // Generic error handling
      return get_response(
        StatusCode.InternalServerError,
        'An unexpected error occurred while creating user',
      );
    }
  }

  // LOGIN WITH JWT
  async loginService(loginUserDto: LoginUserDto): Promise<ServerHTTPResponse> {
    const logger = new Logger('AuthService');
    const { email, password } = loginUserDto;
    const today = new Date();
    const lastLogin = addHours(today, 1);
    const lastLoginString = lastLogin.toISOString();

    try {
      // Input validation
      if (!email || !password) {
        logger.warn(`Login attempt with missing credentials - Email: ${email}`);
        return get_response(
          StatusCode.BadRequest,
          'Email and password are required',
        );
      }

      // Check if user exists
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        logger.warn(`Login attempt for non-existent user: ${email}`);
        // Return same message whether user exists or password is wrong for security
        return get_response(StatusCode.Unauthorized, 'Invalid credentials');
      }

      // Check if password is valid
      const isPasswordValid = await PasswordUtils.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        logger.warn(`Invalid password attempt for user: ${email}`);
        return get_response(StatusCode.Unauthorized, 'Invalid credentials');
      }

      logger.log(`User login successful: ${email}`);

      // Generate tokens
      const accessToken = await this.jwt.generateJwtToken(
        { email: user.email, id: user.id },
        '24h',
      );
      const refreshToken = await this.jwt.generateRefreshToken({
        email: user.email,
        id: user.id,
      });

      // Omit sensitive data from logs
      logger.debug(`Tokens generated for user: ${user.id}`);

      // Update last login field
      await this.prisma.user.update({
        where: {
          email: email,
        },
        data: {
          lastLogin: lastLoginString,
        },
      });

      return get_response(StatusCode.OK, 'Login successful', {
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      logger.error(`Login error for email: ${email}`, error);

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Handle specific Prisma errors
        return get_response(
          StatusCode.InternalServerError,
          'Database error occurred during login',
        );
      }

      // Generic error handling
      return get_response(
        StatusCode.InternalServerError,
        'An unexpected error occurred during login',
      );
    }
  }
}
