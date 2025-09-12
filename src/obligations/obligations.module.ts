import { Module } from '@nestjs/common';
import { ObligationsController } from '@src/obligations/http/obligations.controller';

@Module({
  controllers: [ObligationsController],
})
export class ObligationsModule {}
