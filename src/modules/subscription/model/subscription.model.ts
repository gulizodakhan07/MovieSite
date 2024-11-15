import { Table,Model, Column, DataType } from "sequelize-typescript";

@Table({tableName: 'subscriptions',timestamps: true})
export class Subscription extends Model {
    @Column({type: DataType.BIGINT,autoIncrement: true,primaryKey: true})
    id: number

    @Column({type: DataType.BIGINT})
    amount: number

    @Column({type: DataType.STRING})
    startDate: string

    @Column({type: DataType.STRING})
    endDate: string

    

    
}