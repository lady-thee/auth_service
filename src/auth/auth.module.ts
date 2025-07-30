import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
// import { JWTUtilService } from 'src/utils/jwt.utils';
// import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JWTUtilService } from 'src/utils/jwt.utils';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JWTUtilService],
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFCATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672',
          ],
          queue: 'notification_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ConfigModule,
    JwtModule,
    PrismaModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
