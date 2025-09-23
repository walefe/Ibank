export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;

export abstract class DefaultModel {
  declare readonly id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}
