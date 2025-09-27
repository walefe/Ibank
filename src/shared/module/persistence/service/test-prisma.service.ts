import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class TestPrismaService extends PrismaService {
  async truncateAll(): Promise<void> {
    const tables = await this.$queryRaw<{ tablename: string }[]>`
      SELECT tablename FROM pg_tables WHERE schemaname='public'
    `;

    const tableNames = tables
      .map(({ tablename }) => `"public"."${tablename}"`)
      .filter((t) => !t.includes('_prisma_migrations'));

    if (tableNames.length > 0) {
      const query = `TRUNCATE TABLE ${tableNames.join(', ')} CASCADE;`;
      await this.$executeRawUnsafe(query);
    }
  }
}
