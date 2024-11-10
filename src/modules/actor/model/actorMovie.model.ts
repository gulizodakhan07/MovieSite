import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Movie } from "src/modules/movie/model/movie.model";
import { Actor } from "./actor.model";

@Table({ tableName: 'actor_movies', timestamps: false })
export class ActorMovie extends Model {
  @ForeignKey(() => Actor)
  @Column({ type: DataType.BIGINT, allowNull: false})
  actorId: number;

  @ForeignKey(() => Movie)
  @Column({ type: DataType.BIGINT, allowNull: false })
  movieId: number;
}
