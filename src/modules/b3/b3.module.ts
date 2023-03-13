import { StockCodeModelDB } from '@/modules/b3/models/StockCode.model';
import { B3HistoryModelDB } from '@/modules/b3/models/B3History.model';
import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { B3ScrapperProvider } from '@/modules/b3/providers/b3_scrapper.provider/b3_scrapper.provider';
import { B3Service } from '@/modules/b3/services/b3.service';
import { FiiModelDB } from '@/modules/fii-explorer/model/Fii.entity';
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
  ],
  providers: [
    // B3History
    B3Service,

    // B3ScrapperProvider
    B3ScrapperProvider,

    // B3CrawlerProvider
    B3CrawlerProvider,
  ],
})
export class B3HistoryModule { }
