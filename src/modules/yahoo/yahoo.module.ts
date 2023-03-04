import { YahooController } from '@/modules/yahoo/controllers/yahoo.controller';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { YahooService } from '@/modules/yahoo/services/yahoo.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [YahooController],
  providers: [YahooService, YahooCrawlerProvider],
})
export class YahooModule { }
