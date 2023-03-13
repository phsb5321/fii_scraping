import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { StockCodeModelDB } from '@/modules/b3/models/StockCode.model';
import { YahooDividendHistoryModelDB } from '@/modules/yahoo/models/YahooDividendHistory.model';
import { YahooHistoryModelDB } from '@/modules/yahoo/models/YahooHistory.model';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { YahooService } from '@/modules/yahoo/services/yahoo.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
})
export class YahooModule { }
