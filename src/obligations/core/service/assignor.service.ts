import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignorModel } from '../model/assignor.model';
import { PrismaService } from '@src/shared/module/persistence/service/prisma.service';
import {
  PaginatedResult,
  PaginationService,
} from '@src/shared/module/persistence/service/pagination.service';
import { PaginationDto } from '@src/shared/dto/pagination.dto';
import { Prisma } from '@src/shared/database/prisma/client';

type Input = {
  name: string;
  document: string;
  email: string;
  phone: string;
};

@Injectable()
export class AssignorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async create({
    name,
    document,
    email,
    phone,
  }: Input): Promise<AssignorModel> {
    const existAssignor = await this.prismaService.assignor.findUnique({
      where: {
        email,
      },
    });

    if (existAssignor)
      throw new BadRequestException('This email already exists!');

    const assignorModel = AssignorModel.create({
      name,
      document,
      email,
      phone,
    });

    await this.prismaService.assignor.create({
      data: {
        ...assignorModel,
      },
    });

    return assignorModel;
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<AssignorModel>> {
    const where: Prisma.AssignorWhereInput = {
      deleteAt: {
        equals: null,
      },
    };
    if (paginationDto.search) {
      where.OR = [
        { name: { contains: paginationDto.search, mode: 'insensitive' } },
        { email: { contains: paginationDto.search, mode: 'insensitive' } },
      ];
    }

    return await this.paginationService.paginate<
      AssignorModel,
      Prisma.AssignorWhereInput,
      Prisma.AssignorFindManyArgs
    >(this.prismaService.assignor, paginationDto, { where });
  }

  async findById(input: string): Promise<AssignorModel | null> {
    const assignor = await this.prismaService.assignor.findFirst({
      where: {
        id: input,
        deleteAt: null,
      },
    });

    if (!assignor) return null;

    return AssignorModel.creteFrom(assignor);
  }

  async updateAssignor(
    input: string,
    data: Partial<Input>,
  ): Promise<AssignorModel> {
    const assignorExist = await this.prismaService.assignor.findFirst({
      where: {
        id: input,
        deleteAt: null,
      },
    });

    if (!assignorExist) throw new NotFoundException('Assignor not found.');

    return await this.prismaService.assignor.update({
      where: {
        id: input,
      },
      data,
    });
  }

  async deleteAssignor(input: string) {
    const assignorExist = await this.prismaService.assignor.findFirst({
      where: {
        id: input,
        deleteAt: null,
      },
    });
    if (!assignorExist) throw new NotFoundException('Assignor not found.');
    const timeStamp = new Date();
    await this.prismaService.assignor.update({
      where: {
        id: input,
      },
      data: {
        deleteAt: timeStamp,
      },
    });
  }
}
