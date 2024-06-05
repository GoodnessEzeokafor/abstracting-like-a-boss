import { Table, DataType, Column, Model } from 'sequelize-typescript';
import { CategoryEntity } from 'src/core';

@Table({
  tableName: 'categories',
  timestamps: true,
  paranoid: true,
})
export class Category extends Model<Category> implements CategoryEntity {
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false, unique: true })
  description: string;
}
