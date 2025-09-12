import { Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { ObligationsModule } from '@src/obligations/obligations.module';

@Module({
  imports: [ObligationsModule],
  providers: [PrismaService],
})
export class AppModule {}
