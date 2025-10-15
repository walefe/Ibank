/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '@src/app.module';
import { CreateAssignorDto } from '@src/module/obligations/http/rest/dto/create-assignor.dto';
import { PrismaService } from '@src/module/shared/module/persistence/service/prisma.service';

describe('Assignor (e2e)', () => {
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
    await prisma.payable.deleteMany();
    await prisma.assignor.deleteMany();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "payable", "assignor" RESTART IDENTITY CASCADE`,
    );
  });

  describe('/obligations/assignor (POST)', () => {
    it('should create an assignor', async () => {
      const dto: CreateAssignorDto = {
        name: 'Acme test',
        document: '000.000.000-00',
        email: 'acme@test.com',
        phone: '111111',
      };

      const response = await request(app.getHttpServer())
        .post('/obligations/assignor')
        .send(dto)
        .expect(HttpStatus.CREATED);

      const saved = await prisma.assignor.findFirst();
      expect(saved?.id).toBe(response.body.data.id);
      expect(response.body.data.email).toEqual(dto.email);
    });

    it('should throw error when create an assignor with an exist email', async () => {
      const dto: CreateAssignorDto = {
        name: 'Acme test',
        document: '000.000.000-00',
        email: 'acme@test.com',
        phone: '111111',
      };
      await prisma.assignor.create({
        data: {
          ...dto,
        },
      });

      await request(app.getHttpServer())
        .post('/obligations/payable')
        .send(dto)
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should throw error when body dont match schema', async () => {
      const response = await request(app.getHttpServer())
        .post('/obligations/payable')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      expect(response.body.message).toContain('Validation failed');
    });
  });

  describe('/obligations/assignor (GET)', () => {
    it('should return all assignors', async () => {
      await prisma.assignor.createMany({
        data: [
          {
            name: 'Acme test',
            document: '000.000.000-00',
            email: 'acme1@test.com',
            phone: '111111',
          },
          {
            name: 'Acme test',
            document: '000.000.000-00',
            email: 'acme2@test.com',
            phone: '111111',
          },
        ],
      });
      const response = await request(app.getHttpServer())
        .get('/obligations/assignor')
        .expect(HttpStatus.OK);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('document');
    });

    it('should return an assignor by id', async () => {
      const assignor = await prisma.assignor.create({
        data: {
          name: 'Acme test',
          document: '000.000.000-00',
          email: 'acme@test.com',
          phone: '111111',
        },
      });
      const response = await request(app.getHttpServer())
        .get(`/obligations/assignor/${assignor.id}`)
        .expect(HttpStatus.OK);
      expect(response.body.data.id).toEqual(assignor.id);
    });
  });

  describe('/obligations/assignor/:id (PUT)', () => {
    it('should update an assignor based on :id', async () => {
      const assignor = await prisma.assignor.create({
        data: {
          name: 'Acme test',
          document: '000.000.000-00',
          email: 'acme@test.com',
          phone: '111111',
        },
      });
      const dto = {
        email: 'updated@test.com',
      };

      const result = await request(app.getHttpServer())
        .put(`/obligations/assignor/${assignor.id}`)
        .send(dto)
        .expect(HttpStatus.OK);

      expect(result.body.data.id).toEqual(assignor.id);
      expect(result.body.data.email).toEqual(dto.email);
    });
  });
});
