/**
 * YahooModule:
 * Responsible for managing Yahoo-related data and integrations.
 *
 * - Imports: Database models related to Yahoo stock histories, dividends, and other relevant data.
 * - Providers: Services and providers related to Yahoo data crawling and operations.
 *
 * Future configurations and extensions can be done by adding or updating models,
 * services, and providers in their respective arrays.
 */

import { PrismaService } from '@/app/infra/prisma/prisma.service';
import { BatchProcessorService } from '@/app/utils/batch-processor/batch-processor.service';
import { YahooController } from '@/modules/yahoo/controllers/yahoo-controller/yahoo-controller.controller';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { YahooService } from '@/modules/yahoo/services/yahoo.service';
import { ExtractStockHistoryService } from '@/modules/yahoo/usecases/extract-stock-history/extract-stock-history.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [YahooService, YahooCrawlerProvider, ExtractStockHistoryService, PrismaService, BatchProcessorService],
  controllers: [YahooController],
})
export class YahooModule {}
