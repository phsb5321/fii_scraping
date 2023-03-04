import { Module } from '@nestjs/common';

import { B3CrawlerProvider } from './b3_crawler.provider/b3_crawler.provider';
import { B3ScrapperProvider } from './b3_scrapper.provider/b3_scrapper.provider';

@Module({
  providers: [B3ScrapperProvider, B3CrawlerProvider],
})
export class ProvidersModule { }
