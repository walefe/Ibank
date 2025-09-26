/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '@src/app.module';
import { PrismaService } from '@src/obligations/persistence/service/prisma.service';

describe('Payable (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  beforeEach(async () => {
    await prisma.$transaction([
      prisma.payable.deleteMany(),
      prisma.assignor.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/obligations/payable (POST)', () => {
    it('should create a payable', async () => {
      const assignor = await prisma.assignor.create({
        data: {
          name: 'Acme test',
          document: '000.000.000-00',
          email: 'acme@test.com',
          phone: '111111',
        },
      });

      const dto = {
        value: 1000,
        emissionDate: '2025-12-31',
        assignorId: assignor.id,
      };

      const response = await request(app.getHttpServer())
        .post('/obligations/payable')
        .send(dto)
        .expect(HttpStatus.CREATED);

      expect(response.body.data.assignorId).toEqual(assignor.id);
      const saved = await prisma.payable.findFirst();
      expect(saved?.value).toBe(response.body.data.value);
    });

    it('should throw error when body dont match schema', async () => {
      const response = await request(app.getHttpServer())
        .post('/obligations/payable')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toContain('Validation failed');
    });

    it('should throw error when assignor id dont exists', async () => {
      const dto = {
        value: 1000,
        emissionDate: '2025-12-31',
        assignorId: 'assignor.id',
      };

      await request(app.getHttpServer())
        .post('/obligations/payable')
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('/obligations/payable (GET)', () => {
    it('should return all payables', async () => {
      const assignor = await prisma.assignor.create({
        data: {
          name: 'Acme test',
          document: '000.000.000-00',
          email: 'acme@test.com',
          phone: '111111',
        },
      });

      await prisma.payable.createMany({
        data: [
          {
            value: 2000,
            emissionDate: new Date('2025-11-01'),
            assignorId: assignor.id,
          },
          {
            value: 3000,
            emissionDate: new Date('2025-12-01'),
            assignorId: assignor.id,
          },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/obligations/payable')
        .expect(HttpStatus.OK);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('value');
    });

    it('should return a payable by id', async () => {
      const assignor = await prisma.assignor.create({
        data: {
          name: 'Acme test',
          document: '000.000.000-00',
          email: 'acme@test.com',
          phone: '111111',
        },
      });

      const payable = await prisma.payable.create({
        data: {
          value: 2000,
          emissionDate: new Date('2025-11-01'),
          assignorId: assignor.id,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/obligations/payable/${payable.id}`)
        .expect(HttpStatus.OK);

      expect(response.body.data.id).toEqual(payable.id);
    });
  });
});
