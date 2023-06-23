import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { StockCodeModelDB } from '@/modules/b3/models/StockCode.model';
import { YahooDividendHistoryModelDB } from '@/modules/yahoo/models/YahooDividendHistory.model';
import { YahooHistoryModelDB } from '@/modules/yahoo/models/YahooHistory.model';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { YahooService } from '@/modules/yahoo/services/yahoo.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateYahooStockHistoryService } from './usecases/update-yahoo-stock-history/update-yahoo-stock-history.service';
import { UpdateYahooStockDividendsService } from './usecases/update-yahoo-stock-dividends/update-yahoo-stock-dividends.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      StockModelDB,
      YahooHistoryModelDB,
      StockCodeModelDB,
      YahooDividendHistoryModelDB,
    ]),
  ],
  providers: [
    // YahooService,
    YahooService,

    // YahooCrawlerProvider,
    YahooCrawlerProvider,

    UpdateYahooStockHistoryService,

    UpdateYahooStockDividendsService,
  ],
})
export class YahooModule {}
