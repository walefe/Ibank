import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@src/obligations/persistence/service/prisma.service';
import { PayableModel } from '../model/payable.model';

type Input = {
  value: number;
  emissionDate: string;
  assignorId: string;
};

@Injectable()
export class PayableService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({
    value,
    emissionDate,
    assignorId,
  }: Input): Promise<PayableModel> {
    const existAssignor = await this.prismaService.assignor.findUnique({
      where: {
        id: assignorId,
      },
    });

    if (!existAssignor)
      throw new BadRequestException('Assignor must need exists!');

    const payableModel = PayableModel.create({
      value,
      emissionDate: new Date(emissionDate),
      assignorId,
    });

    await this.prismaService.payable.create({
      data: {
        ...payableModel,
      },
    });

    return payableModel;
  }

  async findAll(): Promise<PayableModel[] | []> {
    return await this.prismaService.payable.findMany();
  }

  async findById(input: string): Promise<PayableModel | null> {
    const payable = await this.prismaService.payable.findFirst({
      where: {
        id: input,
      },
    });

    if (!payable) return null;

    return PayableModel.createFrom(payable);
  }
}
