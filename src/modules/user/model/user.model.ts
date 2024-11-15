import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Device } from 'src/modules/device/model/device.model';

export enum UserRoles {
  user = 'USER',
  admin = 'ADMIN',
}

@Table({ tableName: 'users', timestamps: true })
export class User extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING })
  name: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  isPremium: boolean;

  @Column({ type: DataType.STRING })
  image: string;
  @Column({
    type: DataType.ENUM,
    values: [UserRoles.admin, UserRoles.user],
    allowNull: true,
    defaultValue: UserRoles.user,
  })
  role: UserRoles;

  @HasMany(() => Device)
  devices: Device[];
}
