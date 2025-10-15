import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PayableModel } from '../model/payable.model';
import { PrismaService } from '@src/module/shared/module/persistence/service/prisma.service';
import { PaginationDto } from '@src/module/shared/dto/pagination.dto';
import {
  PaginatedResult,
  PaginationService,
} from '@src/module/shared/module/persistence/service/pagination.service';
import { Prisma } from '@src/module/shared/database/prisma/client';

type Input = {
  value: number;
  emissionDate: string;
  assignorId: string;
};

@Injectable()
export class PayableService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

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

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<PayableModel>> {
    const where: Prisma.PayableWhereInput = {
      deleteAt: {
        equals: null,
      },
    };

    return await this.paginationService.paginate<
      PayableModel,
      Prisma.PayableWhereInput,
      Prisma.PayableFindManyArgs
    >(this.prismaService.payable, paginationDto, { where });
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
