import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Movie } from "src/modules/movie/model/movie.model";
import { ActorMovie } from "./actorMovie.model";

@Table({ tableName: 'actors', timestamps: true })
export class Actor extends Model {

    @Column({ type: DataType.BIGINT, autoIncrement: true, primaryKey: true })
    id: number

    @Column({ type: DataType.STRING, allowNull: false })
    name: string


    @Column({ type: DataType.STRING, allowNull: false })
    bio: string

    @Column({ type: DataType.STRING, allowNull: false })
    image: string

    @BelongsToMany(() => Movie, () => ActorMovie)  // Many-to-many bog'lanishni to'g'ri o'rnatish
    movies: Movie[];



}