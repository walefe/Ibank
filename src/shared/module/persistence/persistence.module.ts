import { Module } from '@nestjs/common';
import { PrismaService } from './service/prisma.service';
import { ConfigModule } from '../config/config.module';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PersistenceModule {}
