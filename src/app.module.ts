import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { Device } from './modules/device/model/device.model';
import { DeviceModule } from './modules/device/device.module';
import { dbConfig } from './config/dbConfig';
import { appConfig } from './config/appConfig';
import { Category } from './modules/category/model/category.model';
import { Movie } from './modules/movie/model/movie.model';
import { User } from './modules/user/model/user.model';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { UploadModule } from './modules/upload/upload.module';
import { MovieModule } from './modules/movie/movie.module';
import { DeviceDetectionModule } from './modules/device-detection/device-detection.module';
import { CategoryModule } from './modules/category/category.module';
import { CheckAuthGuard } from './guard/check-auth.guard';
import { CheckRoleGuard } from './guard/check-role.guard';
import { AppController } from './app.controller';
import { ActorModule } from './modules/actor/actor.module';
import { Actor } from './modules/actor/model/actor.model';
import { ActorMovie } from './modules/actor/model/actorMovie.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig],
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        try {
          return {
            dialect: 'postgres',
            host: config.get('dbConfig.host'),
            port: config.get<number>('dbConfig.port'),
            username: config.get<string>('dbConfig.user'),
            password: config.get<string>('dbConfig.password'),
            database: config.get('dbConfig.dbName'),
            models: [User, Device, Movie, Category,Actor,ActorMovie],
            // synchronize: true,
            // sync: {force: true},
            logging: console.log,
            autoLoadModels: true,
          };
        } catch (error) {
          console.log(error);
        }
      },
    }),
    JwtModule.register({
      global: true,
      secret: 'my-secret-key',
      signOptions: { expiresIn: 120 },
    }),
    UserModule,
    AuthModule,
    UploadModule,
    MovieModule,
    DeviceDetectionModule,
    DeviceModule,
    CategoryModule,
    ActorModule
  ],
  controllers: [AppController],
  providers: [
    {
      useClass: CheckAuthGuard,
      provide: APP_GUARD,
    },
    {
      useClass: CheckRoleGuard,
      provide: APP_GUARD,
    },
  ],
})
export class AppModule {}
