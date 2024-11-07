import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Movie } from 'src/modules/movie/model/movie.model';

@Table({ tableName: 'category', timestamps: true })
export class Category extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  image: string;

  @HasMany(() => Movie, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  movies: Movie[];
}
