import { Test, TestingModule } from '@nestjs/testing';
import { ObligationsController } from './obligations.controller';
import { PrismaService } from '@src/obligations/persistence/prisma.service';

describe('ObligationsController', () => {
  let controller: ObligationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObligationsController],
      providers: [PrismaService],
    }).compile();

    controller = module.get<ObligationsController>(ObligationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a assignor content', () => {
    const response = controller.createAssignor({
      name: 'Acme test',
      document: '000.000.000-00',
      email: 'acme@test.com',
      phone: '111111',
    });

    expect(response).toMatchObject<typeof response>(response);
  });

  it('should return a payble content', () => {
    const response = controller.createObligations({
      value: 100,
      emissionDate: '2025-09-10',
      assignorId: '19b3c421-f391-4669-9aad-a26652195e69',
    });

    expect(response).toMatchObject<typeof response>(response);
  });
});
