import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@src/module/shared/database/prisma/client';
import { ConfigService } from '@src/module/shared/module/config/service/config.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown
{
  constructor(configService: ConfigService) {
    super({
      datasources: {
        db: { url: configService.get('database.url') },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async onApplicationShutdown(signal: string) {
    console.info(`Disconnecting from Prisma on application shutdown ${signal}`);
    await this.$disconnect();
  }
}
