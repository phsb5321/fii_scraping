import { StockModelDB } from '@/app/models/Stock.model';
import { StockCodeModelDB } from '@/app/models/StockCode.model';
import { B3Controller } from '@/modules/b3/controllers/b3-controller/b3-controller.controller';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { B3Service } from '@/modules/b3/services/b3.service';
import { ListAllStocksService } from '@/modules/b3/usecases/list-all-stocks/list-all-stocks.service';
import { ScrapeAllStocksService } from '@/modules/b3/usecases/scrape-all-stocks/scrape-all-stocks.service';
import { UpdateAllStockService } from '@/modules/b3/usecases/update-all-stock/update-all-stock.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  imports: [TypeOrmModule.forFeature([StockModelDB, StockCodeModelDB])],
  providers: [B3Service, B3CrawlerProvider, ScrapeAllStocksService, UpdateAllStockService, ListAllStocksService],
  controllers: [B3Controller],
})
export class B3HistoryModule {}
