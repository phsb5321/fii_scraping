// Import necessary modules and dependencies
import { AppController } from '@/app/controllers/app.controller';
import { InfraModule } from '@/app/infra/infra.module';
import { AppService } from '@/app/services/app.service';
import { ModulesModule } from '@/modules/modules.module';
import { BullModule } from '@nestjs/bull';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

// Define the main application module
@Module({
  imports: [
    // Import the Nest.js scheduler module for handling scheduled tasks
    ScheduleModule.forRoot(),

    // Import the Nest.js configuration module for loading environment variables
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),

    // Import the TypeOrm module for database connection and configuration
    TypeOrmModule.forRoot({
      type: 'mysql', // Database type
      host: process.env.MYSQL_HOST, // Database host
      port: 3306, // Database port
      username: 'root', // Database username
      password: process.env.MYSQL_ROOT_PASSWORD, // Database password
      database: process.env.MYSQL_DATABASE, // Database name
      synchronize: true, // Auto-sync the database with models
      autoLoadEntities: true, // Auto-load all entities
      timezone: '-03:00', // Set Brazil timezone
      dateStrings: true, // Enable date strings formatting
    }),

    // Import the Bull module for handling background jobs
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // Import the application modules
    ModulesModule,

    // Import the infrastructure module
    InfraModule,
  ],
  controllers: [AppController], // Declare the main application controller
  providers: [
    // Register the main application service
    AppService,
  ],
})
// Export the main application module
export class AppModule { }
