import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'movies', timestamps: true })
export class Movie extends Model {
    @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    title: string;

    @Column({ type: DataType.STRING, allowNull: false })
    description: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    releaseYear: number;

    @Column({ type: DataType.STRING, allowNull: true })
    image: string;

    @Column({ type: DataType.STRING, allowNull: true })
    video: string;
}
