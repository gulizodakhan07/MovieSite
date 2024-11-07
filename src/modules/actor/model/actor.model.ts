import { Column, DataType,Model, Table } from "sequelize-typescript";

@Table({tableName: 'actors',timestamps: true})
export class Actor extends Model{

    @Column({type: DataType.BIGINT, autoIncrement: true,primaryKey: true})
    id: number

    @Column({type: DataType.STRING,allowNull: false})
    name: string
    

    @Column({type: DataType.STRING,allowNull: false})
    bio: string

    @Column({type: DataType.STRING,allowNull: false})
    image: string

}