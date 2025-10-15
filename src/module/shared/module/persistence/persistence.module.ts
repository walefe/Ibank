import { Module } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';
import { ConfigModule } from '../config/config.module';
import { PaginationService } from './service/pagination.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PrismaService, PaginationService],
  exports: [PrismaService, PaginationService],
})
export class PersistenceModule {}
