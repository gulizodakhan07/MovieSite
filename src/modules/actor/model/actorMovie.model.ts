import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Actor } from './actor.model';  // Actor modeli
import { Movie } from 'src/modules/movie/model/movie.model';  // Movie modeli

@Table({ tableName: 'actor_movies', timestamps: false })
export class ActorMovie extends Model {
  // Foreign Key for Actor
  @ForeignKey(() => Actor)
  @Column({ type: DataType.BIGINT, allowNull: false })
  actorId: number;

  // Foreign Key for Movie
  @ForeignKey(() => Movie)
  @Column({ type: DataType.BIGINT, allowNull: false })
  movieId: number;
}
