import { B3HistoryModelDB } from '@/modules/b3/models/B3History.model';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { B3ScrapperProvider } from '@/modules/b3/providers/b3_scrapper.provider/b3_scrapper.provider';
import { B3HistoryService } from '@/modules/b3/services/b3.service';
import { FiiModelDB } from '@/modules/fii-explorer/model/Fii.entity';
import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([B3HistoryModelDB, FiiModelDB, StockModelDB]),
  ],
  providers: [
    // B3History
    B3HistoryService,

    // B3ScrapperProvider
    B3ScrapperProvider,

    // B3CrawlerProvider
    B3CrawlerProvider,
  ],
})
export class B3HistoryModule { }
