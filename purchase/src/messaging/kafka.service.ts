import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService
  extends ClientKafka
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    super({
      client: {
        clientId: 'purchase',
        brokers: [configService.get('KAFKA_BROKER')],
      },
    });
  }

  async onModuleDestroy() {
    await this.connect();
  }

  async onModuleInit() {
    await this.close();
  }
}
