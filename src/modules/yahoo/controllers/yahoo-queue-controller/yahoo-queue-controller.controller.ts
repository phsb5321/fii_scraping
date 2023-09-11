import Bottleneck from 'bottleneck';
import { Queue } from 'bull';

import { YahooService } from '@/modules/yahoo/services/yahoo.service';
import { InjectQueue } from '@nestjs/bull';
import { Controller, Get, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * Controller responsible for queuing Yahoo stock update tasks.
 * It uses Bull for managing the job queue and Bottleneck for rate limiting.
 */
@Controller('yahoo-queue')
export class YahooQueueController {
  private readonly limiter: Bottleneck;

  constructor(
    private readonly yahooService: YahooService,
    @InjectQueue('yahoo-stocks-queue') private readonly yahooStocksQueue: Queue,
    @Inject('CONFIG') private readonly config: any // Assuming some global configuration provider
  ) {
    // Initialize Bottleneck limiter with settings from configuration
    this.limiter = new Bottleneck(config.bottleneck);
  }

  /**
   * Endpoint to manually enqueue a Yahoo stock update.
   * @param stockCode The stock code to be updated.
   * @returns A confirmation string.
   */
  @Get('enqueue-update-yahoo-stock')
  async enqueueUpdateYahooStock(stockCode: number): Promise<string> {
    await this.yahooStocksQueue.add('update-yahoo-stock', { stockCode });
    return `Job to update stock ${stockCode} added to queue.`;
  }

  /**
   * Scheduled task to update a Yahoo stock.
   * This task runs at a specified time (e.g., 5 AM) every day.
   * @param stockCode The stock code to be updated.
   */
  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async scheduledUpdateYahooStock(stockCode: number) {
    await this.limiter.schedule(() => this.yahooService.updateStocks(stockCode));
  }
}
