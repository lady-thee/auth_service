/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email of the user',
    example: 'johndoe1@example.com',
    required: true,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Username of the user',
    example: 'johndoe1',
  })
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'password123',
    required: true,
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/, {
    message:
      'Password must contain at least 1 uppercse, 1 number, and 1 special character',
  })
  password: string;
}
