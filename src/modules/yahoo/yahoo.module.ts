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

import { StockModelDB } from "@/modules/b3/models/Stock.model";
import { StockCodeModelDB } from "@/modules/b3/models/StockCode.model";
import { YahooQueueController } from "@/modules/yahoo/controllers/yahoo-queue-controller/yahoo-queue-controller.controller";
import { YahooDividendHistoryModelDB } from "@/modules/yahoo/models/YahooDividendHistory.model";
import { YahooHistoryModelDB } from "@/modules/yahoo/models/YahooHistory.model";
import { YahooCrawlerProvider } from "@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider";
import { YahooService } from "@/modules/yahoo/services/yahoo.service";
import { UpdateYahooStockDividendsService } from "@/modules/yahoo/usecases/update-yahoo-stock-dividends/update-yahoo-stock-dividends.service";
import { UpdateYahooStockHistoryService } from "@/modules/yahoo/usecases/update-yahoo-stock-history/update-yahoo-stock-history.service";
import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockModelDB,
      StockCodeModelDB,
      YahooHistoryModelDB,
      YahooDividendHistoryModelDB,
    ]),

    BullModule.registerQueue({
      name: "yahoo-stocks-queue",
    }),
  ],
  providers: [
    YahooService,
    YahooCrawlerProvider,
    UpdateYahooStockHistoryService,
    UpdateYahooStockDividendsService,
  ],
  controllers: [YahooQueueController],
})
export class YahooModule {}
