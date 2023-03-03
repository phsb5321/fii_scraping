import { Module } from '@nestjs/common';
import { YahooController } from '@/modules/yahoo/controllers/yahoo.controller';
import { YahooService } from '@/modules/yahoo/services/yahoo.service';

@Module({
  controllers: [YahooController],
  providers: [YahooService],
})
export class YahooModule {}
