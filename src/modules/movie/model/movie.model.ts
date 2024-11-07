import {
  Column,
  DataType,
  BelongsTo,
  ForeignKey,
  Model,
  Table,
  BelongsToMany,
} from 'sequelize-typescript';
import { Category } from 'src/modules/category/model/category.model';

@Table({ tableName: 'movie', timestamps: true })
export class Movie extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.INTEGER, allowNull: false })
  releaseYear: number;

  @Column({ type: DataType.STRING, allowNull: false })
  genre: string;

  @Column({ type: DataType.STRING, allowNull: true })
  image: string;

  @Column({ type: DataType.STRING, allowNull: true })
  video: string;

  @ForeignKey(() => Category)
  @Column({ type: DataType.BIGINT, allowNull: false })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  // @BelongsToMany(() => Actor, () => ActorMovie)
  // actors: Actor[];
}
