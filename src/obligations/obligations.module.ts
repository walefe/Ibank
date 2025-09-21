import { Module } from '@nestjs/common';
import { PrismaService } from '@src/prisma.service';
import { ObligationsController } from './http/rest/controller/obligations.controller';

@Module({
  controllers: [ObligationsController],
  providers: [PrismaService],
})
export class ObligationsModule {}
