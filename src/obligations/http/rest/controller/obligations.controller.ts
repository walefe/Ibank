import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common';

import { PayableModel } from '@src/obligations/core/model/payable.model';
import { AssignorModel } from '@src/obligations/core/model/assignor.model';

import {
  createPayableSchema,
  type CreatePayableDto,
} from '../dto/create-payable.dto';

import {
  createAssignorSchema,
  type CreateAssignorDto,
} from '../dto/create-assignor.dto';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { PrismaService } from '@src/obligations/persistence/prisma.service';

@Controller('obligations')
@Injectable()
export class ObligationsController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('payable')
  async getPayables() {
    const payables = await this.prismaService.payable.findMany();
    return {
      data: payables,
    };
  }

  @Get('payable/:id')
  async findOnePayable(@Param('id') id: string) {
    const payable = await this.prismaService.payable.findFirst({
      where: {
        id,
      },
    });
    return {
      data: payable,
    };
  }

  @Get('assignor')
  async getAssignors() {
    const assignors = await this.prismaService.assignor.findMany();
    return {
      data: assignors,
    };
  }

  @Get('assignor/:id')
  async findOneAssignor(@Param('id') id: string) {
    const assignor = await this.prismaService.assignor.findFirst({
      where: {
        id,
      },
    });
    return {
      data: assignor,
    };
  }

  @Post('payable')
  @UsePipes(new ZodValidationPipe(createPayableSchema))
  async createObligations(@Body() createPayableDto: CreatePayableDto) {
    const model = PayableModel.create({
      ...createPayableDto,
      emissionDate: new Date(createPayableDto.emissionDate),
    });

    await this.prismaService.payable.create({
      data: {
        ...model,
      },
    });

    return model;
  }

  @Post('assignor')
  @UsePipes(new ZodValidationPipe(createAssignorSchema))
  async createAssignor(@Body() createAssignorDto: CreateAssignorDto) {
    const model = AssignorModel.create(createAssignorDto);

    await this.prismaService.assignor.create({
      data: {
        ...model,
      },
    });

    return model;
  }
}
