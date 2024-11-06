import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../user/model";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { GoogleStrategy } from "./strategy";

@Module({
    imports: [SequelizeModule.forFeature([User])],
    providers: [AuthService,GoogleStrategy],
    controllers: [AuthController]
})
export class AuthModule{}