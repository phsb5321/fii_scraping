import { AppController } from '@/app/controllers/app.controller';
import { AppService } from '@/app/services/app.service';
import { ModulesModule } from '@/modules/modules.module';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Scheduler
    ScheduleModule.forRoot(),

    // Config
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),

    // Database
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: 'root',
      password: process.env.MYSQL_ROOT_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      synchronize: true,
      autoLoadEntities: true,
    }),

    // Modules
    ModulesModule,
  ],
  controllers: [AppController],
  providers: [
    // AppService
    AppService,
  ],
})
export class AppModule {}
