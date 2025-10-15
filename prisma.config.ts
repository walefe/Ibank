import 'dotenv/config';
import { join } from 'node:path';
import type { PrismaConfig } from 'prisma/config';

export default {
  schema: join(
    'src',
    'module',
    'shared',
    'database',
    'prisma',
    'schema.prisma',
  ),
  migrations: {
    path: join('src', 'module', 'shared', 'database', 'prisma', 'migrations'),
  },
} satisfies PrismaConfig;
