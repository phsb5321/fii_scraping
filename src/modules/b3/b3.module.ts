import { PrismaService } from '@/app/infra/prisma/prisma.service';
import { BatchProcessorService } from '@/app/utils/batch-processor/batch-processor.service';
import { B3Controller } from '@/modules/b3/controllers/b3-controller/b3-controller.controller';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { ScrapeAllStocksService } from '@/modules/b3/usecases/scrape-all-stocks/scrape-all-stocks.service';
import { UpdateAllStockService } from '@/modules/b3/usecases/update-all-stock/update-all-stock.service';
import { Module } from '@nestjs/common';

/**
 * B3HistoryModule:
 * This module is responsible for managing the stocks and their histories.
 * It integrates with the B3 database models, provides the necessary services for data manipulation,
 * registers the processing queues, and sets up the associated controllers.
 *
 * Structure:
 * - Imports: Database models, bull queues, and other NestJS modules.
 * - Providers: Service providers and use case services.
 * - Controllers: API route controllers associated with this module.
 */
@Module({
  imports: [],
  providers: [B3CrawlerProvider, ScrapeAllStocksService, UpdateAllStockService, PrismaService, BatchProcessorService],
  controllers: [B3Controller],
})
export class B3HistoryModule {}
