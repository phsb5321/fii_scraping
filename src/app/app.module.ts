// Import necessary modules and dependencies
import { InfraModule } from '@/app/infra/infra.module';
import { ModulesModule } from '@/modules/modules.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';

// Define the main application module
@Module({
  imports: [
    // Import the Nest.js devtools module for debugging
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
      port: 3500,
    }),

    // Import the Nest.js scheduler module for handling scheduled tasks
    ScheduleModule.forRoot(),

    // Import the Nest.js configuration module for loading environment variables
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),

    // Import Event Emitter module
    EventEmitterModule.forRoot(),

    // Import the application modules
    ModulesModule,

    // Import the infrastructure module
    InfraModule,
  ],
  controllers: [], // Declare the main application controller
  providers: [
    // Register the main application service
  ],
})
// Export the main application module
export class AppModule {}
