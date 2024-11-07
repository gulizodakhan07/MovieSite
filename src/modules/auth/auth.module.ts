import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../user/model/user.model';
import { GoogleStrategy } from './strategy/google.strategy';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
