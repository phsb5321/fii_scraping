import { AppController } from '@/app/controllers/app.controller';
import { AppService } from '@/app/services/app.service';
import { ModulesModule } from '@/modules/modules.module';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfraModule } from '@/app/infra/infra.module';
import { EntitiesModule } from './entities/entities.module';

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
      // Brasil timezone
      timezone: '-03:00',
      // Date format dd/mm/yyyy
      dateStrings: true,
    }),

    // Modules
    ModulesModule,

    InfraModule,

    EntitiesModule,
  ],
  controllers: [AppController],
  providers: [
    // AppService
    AppService,
  ],
})
export class AppModule { }
