import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PayableModel } from '../model/payable.model';
import { PrismaService } from '@src/shared/module/persistence/service/prisma.service';

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
    const existAssignor = await this.prismaService.assignor.findFirst({
      where: {
        id: assignorId,
        deleteAt: null,
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
    return await this.prismaService.payable.findMany({
      where: {
        deleteAt: {
          equals: null,
        },
      },
    });
  }

  async findById(input: string): Promise<PayableModel | null> {
    const payable = await this.prismaService.payable.findFirst({
      where: {
        id: input,
        deleteAt: null,
      },
    });

    if (!payable) return null;

    return PayableModel.createFrom(payable);
  }

  async updatePayable(
    input: string,
    data: Partial<Input>,
  ): Promise<PayableModel> {
    const payableExist = await this.prismaService.payable.findFirst({
      where: {
        id: input,
        deleteAt: null,
      },
    });

    if (!payableExist) throw new NotFoundException('Payable not found.');

    return await this.prismaService.payable.update({
      where: {
        id: input,
      },
      data,
    });
  }

  async deletePayable(input: string) {
    const payableExist = await this.prismaService.payable.findFirst({
      where: {
        id: input,
        deleteAt: null,
      },
    });
    if (!payableExist) throw new NotFoundException('Payable not found.');
    const timeStamp = new Date();
    await this.prismaService.payable.update({
      where: {
        id: input,
      },
      data: {
        deleteAt: timeStamp,
      },
    });
  }
}
