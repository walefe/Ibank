import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';

import {
  createPayableSchema,
  type CreatePayableDto,
} from '../dto/create-payable.dto';

import {
  createAssignorSchema,
  type CreateAssignorDto,
} from '../dto/create-assignor.dto';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { AssignorService } from '@src/obligations/core/service/assignor.service';
import { PayableService } from '@src/obligations/core/service/payable.service';
import {
  type UpdateAssignorDto,
  updateAssignorSchema,
} from '../dto/update-assignore.dto';

@Controller('obligations')
@Injectable()
export class ObligationsController {
  constructor(
    private readonly assignorService: AssignorService,
    private readonly payableService: PayableService,
  ) {}

  @Get('payable')
  async getPayables() {
    const output = await this.payableService.findAll();
    return {
      data: output,
    };
  }

  @Get('payable/:id')
  async findOnePayable(@Param('id') id: string) {
    const output = await this.payableService.findById(id);

    return {
      data: output,
    };
  }

  @Get('assignor')
  async getAssignors() {
    const output = await this.assignorService.findAll();
    return {
      data: output,
    };
  }

  @Get('assignor/:id')
  async findOneAssignor(@Param('id') id: string) {
    const output = await this.assignorService.findById(id);
    return {
      data: output,
    };
  }

  @Post('payable')
  @UsePipes(new ZodValidationPipe(createPayableSchema))
  async createObligations(@Body() createPayableDto: CreatePayableDto) {
    const output = await this.payableService.create(createPayableDto);

    return {
      data: output,
    };
  }

  @Post('assignor')
  @UsePipes(new ZodValidationPipe(createAssignorSchema))
  async createAssignor(@Body() createAssignorDto: CreateAssignorDto) {
    const output = await this.assignorService.create(createAssignorDto);

    return {
      data: output,
    };
  }

  @Put('assignor/:id')
  async updateAssignor(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateAssignorSchema))
    updateAssignorDto: UpdateAssignorDto,
  ) {
    console.log(id);
    const output = await this.assignorService.updateAssignor(
      id,
      updateAssignorDto,
    );

    return {
      data: output,
    };
  }
}
