import { Module } from '@nestjs/common';

import { ObligationsModule } from '@src/obligations/obligations.module';
import { ConfigModule } from './obligations/infra/module/config/config.module';
import { ObligationsService } from './obligations/core/service/obligations.service';

@Module({
  imports: [ConfigModule.forRoot(), ObligationsModule],
  providers: [ObligationsService],
})
export class AppModule {}
