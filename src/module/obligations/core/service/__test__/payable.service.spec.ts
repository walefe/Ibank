import { Test, TestingModule } from '@nestjs/testing';
import { PayableService } from '../payable.service';
import { PayableModel } from '../../model/payable.model';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '@src/shared/module/persistence/service/prisma.service';

describe('Payable Service (unit)', () => {
  let service: PayableService;

  const mockPrisma = {
    assignor: { findUnique: jest.fn() },
    payable: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayableService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PayableService>(PayableService);
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create a payable when assignor exists', async () => {
      mockPrisma.assignor.findUnique.mockResolvedValue({ id: 'assignor-uuid' });
      mockPrisma.payable.create.mockResolvedValue({
        id: 'payable-uuid',
        value: 100,
        emissionDate: new Date('2025-09-21T00:00:00.000Z'),
        assignorId: 'assignor-uuid',
      });

      const result = await service.create({
        value: 100,
        emissionDate: '2025-09-21',
        assignorId: 'assignor-uuid',
      });

      expect(mockPrisma.assignor.findUnique).toHaveBeenCalledWith({
        where: { id: 'assignor-uuid' },
      });
      expect(mockPrisma.payable.create).toHaveBeenCalled();
      expect(result).toBeInstanceOf(PayableModel);
      expect(result.value).toBe(100);
    });

    it('should throw if assignor does not exist', async () => {
      mockPrisma.assignor.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          value: 200,
          emissionDate: '2025-09-21',
          assignorId: 'nonexistent',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll()', () => {
    it('should return all payables', async () => {
      mockPrisma.payable.findMany.mockResolvedValue([
        { id: 'p1', value: 100 },
        { id: 'p2', value: 200 },
      ]);
      const result = await service.findAll();

      expect(mockPrisma.payable.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].value).toBe(100);
    });
  });

  describe('findById()', () => {
    it('should return payable if found', async () => {
      mockPrisma.payable.findFirst.mockResolvedValue({
        id: 'p1',
        value: 100,
        emissionDate: new Date(),
        assignorId: 'assigor-uuid',
      });
      const result = await service.findById('p1');

      expect(mockPrisma.payable.findFirst).toHaveBeenCalled();
      expect(result).toBeInstanceOf(PayableModel);
      expect(result?.id).toBe('p1');
    });

    it('should return `null` if not found', async () => {
      mockPrisma.payable.findFirst.mockResolvedValue(null);
      const result = await service.findById('does-not-exist');

      expect(result).toBeNull();
    });
  });
});
