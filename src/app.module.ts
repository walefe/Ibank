import { Module } from '@nestjs/common';

import { ObligationsModule } from '@src/obligations/obligations.module';
import { ConfigModule } from './shared/module/config/config.module';

@Module({
  imports: [ConfigModule.forRoot(), ObligationsModule],
})
export class AppModule {}
