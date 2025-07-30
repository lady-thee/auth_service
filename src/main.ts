/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

const logger = new Logger();

async function bootstrap() {
  console.log('Starting Auth microservice...');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@rabbitmq:5672'],
        queue: 'auth_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
  console.log('Auth microservice is listening on the "auth_queue"');
  logger.log('Auth service is listening on the "auth_queue');
}
void bootstrap();
