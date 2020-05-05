import {
  Model,
  Column,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AutoIncrement,
} from 'sequelize-typescript';

export class BaseEntity<T> extends Model<T> {
  @AutoIncrement
  @PrimaryKey
  @Column
  public readonly id!: number;

  @CreatedAt
  public readonly createdAt!: Date;

  @UpdatedAt
  public readonly updatedAt!: Date;

  @DeletedAt
  public readonly deletedAt!: Date;
}
