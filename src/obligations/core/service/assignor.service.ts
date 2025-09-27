import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AssignorModel } from '../model/assignor.model';
import { PrismaService } from '@src/shared/module/persistence/service/prisma.service';

type Input = {
  name: string;
  document: string;
  email: string;
  phone: string;
};

@Injectable()
export class AssignorService {
  constructor(private readonly prismaService: PrismaService) {}

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

  async findAll(): Promise<AssignorModel[] | []> {
    return await this.prismaService.assignor.findMany({
      where: {
        deleteAt: {
          equals: null,
        },
      },
    });
  }

  async findById(input: string): Promise<AssignorModel | null> {
    const assignor = await this.prismaService.assignor.findFirst({
      where: {
        id: input,
      },
    });

    if (!assignor) return null;

    return AssignorModel.creteFrom(assignor);
  }

  async updateAssignor(
    input: string,
    data: Partial<Input>,
  ): Promise<AssignorModel> {
    const assignorExist = await this.prismaService.assignor.findUnique({
      where: {
        id: input,
      },
    });

    if (!assignorExist) throw new NotFoundException();

    return await this.prismaService.assignor.update({
      where: {
        id: input,
      },
      data,
    });
  }

  async deleteAssignor(input: string) {
    const assignorExist = await this.prismaService.assignor.findUnique({
      where: {
        id: input,
      },
    });
    if (!assignorExist) throw new NotFoundException();
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
