import { Module } from '@nestjs/common';

import { ObligationsController } from './http/rest/controller/obligations.controller';
import { AssignorService } from './core/service/assignor.service';
import { PayableService } from './core/service/payable.service';
import { PersistenceModule } from '@src/module/shared/module/persistence/persistence.module';

@Module({
  imports: [PersistenceModule],
  controllers: [ObligationsController],
  providers: [AssignorService, PayableService],
})
export class ObligationsModule {}
