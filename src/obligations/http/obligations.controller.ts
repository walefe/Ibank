import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@src/zod-validation.pipe';
import { createSchema, type CreatePayableDto } from '../create-payable.dto';
import { PayableModel } from '../core/model/payable.model';

@Controller('obligations')
export class ObligationsController {
  @Post()
  @UsePipes(new ZodValidationPipe(createSchema))
  getObligations(@Body() createPayableDto: CreatePayableDto) {
    const model = PayableModel.create({
      ...createPayableDto,
      emissionDate: new Date(createPayableDto.emissionDate),
    });

    return model;
  }
}
