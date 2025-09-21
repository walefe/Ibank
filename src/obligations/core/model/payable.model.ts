import { randomUUID } from 'node:crypto';

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export class PayableModel {
  declare id: string;
  declare value: number;
  declare emissionDate: Date;
  declare assignorId: string;

  private constructor(data: PayableModel) {
    Object.assign(this, data);
  }

  static create(data: WithOptional<PayableModel, 'id'>): PayableModel {
    return new PayableModel({
      ...data,
      id: randomUUID(),
    });
  }

  static createFrom(data: PayableModel): PayableModel {
    return new PayableModel(data);
  }
}
