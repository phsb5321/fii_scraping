// Data Base Models
import { B3HistoryModelDB } from '@/modules/b3/models/B3History.model';
import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { StockCodeModelDB } from '@/modules/b3/models/StockCode.model';

// Providers
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { B3ScrapperProvider } from '@/modules/b3/providers/b3_scrapper.provider/b3_scrapper.provider';

// Services
import { B3Service } from '@/modules/b3/services/b3.service';

// Usecases
import { ScrapeAllStocksService } from '@/modules/b3/usecases/scrape-all-stocks/scrape-all-stocks.service';
import { ScrapeB3HistoryService } from '@/modules/b3/usecases/scrape-b3-history/scrape-b3-history.service';
import { UpdateAllStockService } from '@/modules/b3/usecases/update-all-stock/update-all-stock.service';

// Libs
import { FiiModelDB } from '@/modules/fii-explorer/model/Fii.entity';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      B3HistoryModelDB,
      FiiModelDB,
      StockModelDB,
      StockCodeModelDB,
    ]),

    BullModule.registerQueue({
      name: 'stocks-queue',
    }),
  ],
  providers: [
    // B3History
    B3Service,

    // B3ScrapperProvider
    B3ScrapperProvider,

    // B3CrawlerProvider
    B3CrawlerProvider,

    // Usecases
    ScrapeAllStocksService,
    UpdateAllStockService,
    ScrapeB3HistoryService,
  ],
})
export class B3HistoryModule { }
