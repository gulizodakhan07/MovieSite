import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, dbConfig } from './config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, UserModule } from './modules';
import { AuthModule } from './modules/auth';
import { JwtModule } from '@nestjs/jwt';
import { CheckAuthGuard, CheckRoleGuard } from './guard';
import { APP_GUARD } from '@nestjs/core';
import { MovieModule } from './modules/movie';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig,dbConfig]
    }),
  
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService)=>{
        try {
          const isDevelopment = config.get<string>('NODE_ENV') === 'development';
          return {
            dialect: 'postgres',
            host: config.get('dbConfig.host'),
            port: config.get<number>('dbConfig.port'),
            username: config.get<string>('dbConfig.user'),
            password: config.get<string>('dbConfig.password'),
            database: config.get('dbConfig.dbName'),
            models: [User],
            // synchronize: true,
            sync: isDevelopment ? { force: true } : undefined,
            logging: console.log,
            autoLoadModels: true
          }
          
        } catch (error) {
          console.log(error)
          
        }
      }
    }),
    JwtModule.register({
      global: true,
      secret: 'my-secret-key',
      signOptions: {expiresIn: 120}
    }),
    UserModule,
    AuthModule,
    UploadModule,
    MovieModule
  ],
  controllers: [],
  providers: [{
    useClass: CheckAuthGuard,
    provide: APP_GUARD,
  },
  {
    useClass: CheckRoleGuard,
    provide: APP_GUARD,
  }],
})
export class AppModule {}
