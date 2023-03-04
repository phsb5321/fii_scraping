import { Module } from '@nestjs/common';
import { YahooService } from '@/modules/yahoo/services/yahoo.service';

@Module({
  controllers: [],
  providers: [YahooService],
})
export class YahooModule {}
