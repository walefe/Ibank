import { Module } from '@nestjs/common';

import { ObligationsController } from './http/rest/controller/obligations.controller';
import { AssignorService } from './core/service/assignor.service';
import { PrismaService } from './persistence/prisma.service';
import { PayableService } from './core/service/payable.service';

@Module({
  controllers: [ObligationsController],
  providers: [AssignorService, PayableService, PrismaService],
})
export class ObligationsModule {}
