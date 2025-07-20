import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
// import { JWTUtilService } from 'src/utils/jwt.utils';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JWTUtilService } from 'src/utils/jwt.utils';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JWTUtilService],
  imports: [ConfigModule, JwtModule, PrismaModule],
  exports: [AuthService],
})
export class AuthModule {}
