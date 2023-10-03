import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService
 *
 * This service is responsible for handling connections with the database using Prisma Client.
 * It provides methods to perform database operations and should be injected wherever database access is needed.
 *
 * It implements OnModuleInit and OnModuleDestroy to handle connection management.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * onModuleInit
   *
   * A lifecycle hook that is called when the Prisma module is initialized.
   * It connects to the database using the Prisma Client.
   *
   * @returns {Promise<void>}
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  /**
   * onModuleDestroy
   *
   * A lifecycle hook that is called when the application is closed.
   * It disconnects the Prisma Client from the database.
   *
   * @returns {Promise<void>}
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
