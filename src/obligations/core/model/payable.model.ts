import { randomUUID } from 'node:crypto';
import { DefaultModel, WithOptional } from './default.model';

export class PayableModel extends DefaultModel {
  declare id: string;
  declare value: number;
  declare emissionDate: Date;
  declare assignorId: string;

  private constructor(data: PayableModel) {
    super();
    Object.assign(this, data);
  }

  static create(
    data: WithOptional<PayableModel, 'id' | 'createdAt' | 'updatedAt'>,
  ): PayableModel {
    return new PayableModel({
      ...data,
      id: data.id ? data.id : randomUUID(),
      createdAt: data.createdAt ? data.createdAt : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt : new Date(),
    });
  }

  static createFrom(data: PayableModel): PayableModel {
    return new PayableModel(data);
  }
}
