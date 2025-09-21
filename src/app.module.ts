import { Module } from '@nestjs/common';

import { ObligationsModule } from '@src/obligations/obligations.module';

@Module({
  imports: [ObligationsModule],
})
export class AppModule {}
