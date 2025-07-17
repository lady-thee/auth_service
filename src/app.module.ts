/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JWTUtilService } from './utils/jwt.utils';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY') || 'null',
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '60m',
        },
      }),
      global: true,
      // ThrottlerModule.forRoot([{ limit: 5, ttl: 60 }]),
    }),
    PrismaModule,
  ],
  exports: [JWTUtilService],
  controllers: [AppController],
  providers: [AppService, JWTUtilService],
})
export class AppModule {}
