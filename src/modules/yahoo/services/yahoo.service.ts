import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { YahooHistoryModelDB } from './../models/YahooHistory.model';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Cron Explanation
// ┌───────────── second (optional)
// │ ┌───────────── minute
// │ │ ┌───────────── hour
// │ │ │ ┌───────────── day of month
// │ │ │ │ ┌───────────── month
// │ │ │ │ │ ┌───────────── day of week
// │ │ │ │ │ │
// │ │ │ │ │ │
// * * * * * *

const CRON_TIME_EVERY_MINUTE = '* * * * * *';
const CRON_TIME_EVERY_5_MINUTES = '*/5 * * * * *';
const CRON_TIME_EVERY_2_HOURS = '0 */2 * * * *';
const CRON_TIME_EVERY_DAY_AT_8AM = '0 0 8 * * *';
@Injectable()
export class YahooService {
  private readonly logger = new Logger(YahooService.name);

  constructor(
    @InjectRepository(YahooHistoryModelDB)
    private yahooHistoryModelDB: Repository<YahooHistoryModelDB>,

    @InjectRepository(StockModelDB)
    private stockModelDB: Repository<StockModelDB>,

    @InjectRepository(YahooCrawlerProvider)
    private yahooCrawlerProvider: YahooCrawlerProvider,
  ) { }

  // @Cron(CRON_TIME_EVERY_DAY_AT_8AM)
  async updateStocksHistory() {
    // Get all stocks
    const stocks = await this.stockModelDB.find();

  }
}
