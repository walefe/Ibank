import { Module } from '@nestjs/common';
import { PrismaService } from '@src/obligations/persistence/prisma.service';

import { ObligationsController } from './http/rest/controller/obligations.controller';

@Module({
  controllers: [ObligationsController],
  providers: [PrismaService],
})
export class ObligationsModule {}
