import { randomUUID } from 'node:crypto';
import { DefaultModel, WithOptional } from './default.model';

export class AssignorModel extends DefaultModel {
  declare id: string;
  declare document: string;
  declare email: string;
  declare phone: string;
  declare name: string;

  private constructor(data: AssignorModel) {
    super();
    Object.assign(this, data);
  }

  static create(
    data: WithOptional<AssignorModel, 'id' | 'createdAt' | 'updatedAt'>,
  ): AssignorModel {
    return new AssignorModel({
      ...data,
      id: data.id ? data.id : randomUUID(),
      createdAt: data.createdAt ? data.createdAt : new Date(),
      updatedAt: data.updatedAt ? data.updatedAt : new Date(),
    });
  }

  static creteFrom(data: AssignorModel): AssignorModel {
    return new AssignorModel(data);
  }
}
