import { Table,Model, Column, DataType } from "sequelize-typescript";

@Table({tableName: 'likes',timestamps: true})
export class Likes extends Model{
    @Column({type: DataType.BIGINT,primaryKey: true,autoIncrement: true})
    id: number

    @Column({type: DataType.ENUM})
    rating: [1,2,3,4,5]
    
}