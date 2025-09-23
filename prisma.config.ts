import 'dotenv/config';
import { join } from 'node:path';
import type { PrismaConfig } from 'prisma/config';

export default {
  schema: join(
    'src',
    'obligations',
    'infra',
    'database',
    'prisma',
    'schema.prisma',
  ),
  migrations: {
    path: join(
      'src',
      'obligations',
      'infra',
      'database',
      'prisma',
      'migrations',
    ),
  },
} satisfies PrismaConfig;
