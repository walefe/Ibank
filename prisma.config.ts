import 'dotenv/config';
import { join } from 'node:path';
import type { PrismaConfig } from 'prisma/config';

export default {
  schema: join('src', 'prisma', 'schema.prisma'),
  migrations: {
    path: join('src', 'prisma', 'migrations'),
  },
} satisfies PrismaConfig;
