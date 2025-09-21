import { randomUUID } from 'node:crypto';

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export class AssignorModel {
  declare id: string;
  declare document: string;
  declare email: string;
  declare phone: string;
  declare name: string;

  private constructor(data: AssignorModel) {
    Object.assign(this, data);
  }

  static create(data: WithOptional<AssignorModel, 'id'>): AssignorModel {
    return new AssignorModel({
      ...data,
      id: randomUUID(),
    });
  }

  static creteFrom(data: AssignorModel): AssignorModel {
    return new AssignorModel(data);
  }
}
