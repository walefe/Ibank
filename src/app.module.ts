import { Module } from '@nestjs/common';
import { ObligationsModule } from '@src/module/obligations/obligations.module';
import { ConfigModule } from './module/shared/module/config/config.module';

@Module({
  imports: [ConfigModule.forRoot(), ObligationsModule],
})
export class AppModule {}
