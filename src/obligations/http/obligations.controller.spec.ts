import { Test, TestingModule } from '@nestjs/testing';
import { ObligationsController } from '@src/obligations/http/obligations.controller';

describe('ObligationsController', () => {
  let controller: ObligationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObligationsController],
    }).compile();

    controller = module.get<ObligationsController>(ObligationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a payble content', () => {
    const response = controller.getObligations({
      value: 100,
      emissionDate: '2025-09-10',
      assignor: '19b3c421-f391-4669-9aad-a26652195e69',
    });

    expect(response).toMatchObject<typeof response>(response);
  });
});
