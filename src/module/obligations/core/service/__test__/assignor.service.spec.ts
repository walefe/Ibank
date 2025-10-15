import { Test, TestingModule } from '@nestjs/testing';
import { AssignorService } from '../assignor.service';
import { AssignorModel } from '../../model/assignor.model';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/shared/module/persistence/service/prisma.service';

describe('Assignor Service (unit)', () => {
  let service: AssignorService;

  const mockPrisma = {
    assignor: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssignorService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<AssignorService>(AssignorService);
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create an assignor', async () => {
      mockPrisma.assignor.create.mockResolvedValue({
        document: '000000',
        email: 'assignor@test.com',
        name: 'assignor',
        phone: '111111',
      });

      const result = await service.create({
        document: '000000',
        email: 'assignor@test.com',
        name: 'assignor',
        phone: '111111',
      });

      expect(mockPrisma.assignor.findUnique).toHaveBeenCalledWith({
        where: {
          email: 'assignor@test.com',
        },
      });
      expect(mockPrisma.assignor.create).toHaveBeenCalled();
      expect(result).toBeInstanceOf(AssignorModel);
      expect(result.email).toBe('assignor@test.com');
    });

    it('should throw if already exists an assignor with the same email', async () => {
      mockPrisma.assignor.findUnique.mockResolvedValue({
        document: '000000',
        email: 'assignor@test.com',
        name: 'assignor',
        phone: '111111',
      });

      await expect(
        service.create({
          document: '000000',
          email: 'assignor@test.com',
          name: 'assignor',
          phone: '111111',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll()', () => {
    it('should return all payables', async () => {
      mockPrisma.assignor.findMany.mockResolvedValue([
        { id: 'p1', email: 'assignor@test.com' },
        { id: 'p2', email: 'assignor1@test.com' },
      ]);
      const result = await service.findAll();

      expect(mockPrisma.assignor.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].email).toBe('assignor@test.com');
    });
  });

  describe('findById()', () => {
    it('should return assignor if found', async () => {
      mockPrisma.assignor.findFirst.mockResolvedValue({
        id: 'p1',
        document: '000000',
        email: 'assignor@test.com',
        name: 'assignor',
        phone: '111111',
      });
      const result = await service.findById('p1');

      expect(mockPrisma.assignor.findFirst).toHaveBeenCalled();
      expect(result).toBeInstanceOf(AssignorModel);
      expect(result?.id).toBe('p1');
    });

    it('should return `null` if not found', async () => {
      mockPrisma.assignor.findFirst.mockResolvedValue(null);
      const result = await service.findById('does-not-exist');

      expect(result).toBeNull();
    });
  });

  describe('update()', () => {
    it('should update an assignor', async () => {
      const existAssignor = {
        id: 'assignor-id',
        document: '000000',
        email: 'assignor@test.com',
        name: 'assignor',
        phone: '111111',
      };
      const updatedAssignor = {
        ...existAssignor,
        name: 'Updated',
        phone: '000000',
      };

      mockPrisma.assignor.findUnique.mockResolvedValue(existAssignor);
      mockPrisma.assignor.update.mockResolvedValue(updatedAssignor);

      const result = await service.updateAssignor('assignor-id', {
        name: 'Updated',
        phone: '000000',
      });

      expect(mockPrisma.assignor.update).toHaveBeenCalled();
      expect(mockPrisma.assignor.update).toHaveBeenCalledWith({
        where: { id: 'assignor-id' },
        data: { name: 'Updated', phone: '000000' },
      });
      expect(result).toEqual(updatedAssignor);
    });

    it('should throw when assignor id does not exist', async () => {
      const assignor = {
        id: 'assignor-id',
        document: '000000',
        email: 'assignor@test.com',
        name: 'assignor',
        phone: '111111',
      };
      mockPrisma.assignor.update.mockResolvedValue(assignor);

      await expect(
        service.updateAssignor('error-id', {
          name: 'Updated',
          phone: '000000',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
