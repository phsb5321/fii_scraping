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

import { StockModelDB } from '@/app/models/Stock.model';
import { StockCodeModelDB } from '@/app/models/StockCode.model';
import { YahooDividendHistoryModelDB } from '@/app/models/YahooDividendHistory.model';
import { YahooHistoryModelDB } from '@/app/models/YahooHistory.model';
import { YahooController } from '@/modules/yahoo/controllers/yahoo-controller/yahoo-controller.controller';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { YahooService } from '@/modules/yahoo/services/yahoo.service';
import { ExtractStockHistoryService } from '@/modules/yahoo/usecases/extract-stock-history/extract-stock-history.service';
import { UpdateYahooStockDividendsService } from '@/modules/yahoo/usecases/update-yahoo-stock-dividends/update-yahoo-stock-dividends.service';
import { UpdateYahooStockHistoryService } from '@/modules/yahoo/usecases/update-yahoo-stock-history/update-yahoo-stock-history.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([StockModelDB, StockCodeModelDB, YahooHistoryModelDB, YahooDividendHistoryModelDB]),
  ],
  providers: [
    YahooService,
    YahooCrawlerProvider,
    UpdateYahooStockHistoryService,
    UpdateYahooStockDividendsService,
    ExtractStockHistoryService,
  ],
  controllers: [YahooController],
})
export class YahooModule {}
