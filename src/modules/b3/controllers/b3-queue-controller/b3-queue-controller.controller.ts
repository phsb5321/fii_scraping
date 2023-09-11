import Bottleneck from 'bottleneck';
import { Queue } from 'bull';

import { B3Service } from '@/modules/b3/services/b3.service';
import { InjectQueue } from '@nestjs/bull';
import { Controller, Get } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * B3QueueController is responsible for scheduling and enqueuing tasks related to the B3Service.
 * It uses both the Bottleneck library for rate limiting and the Bull library for task queuing.
 */
@Controller('queue')
export class B3QueueController {
  private limiter: Bottleneck;

  constructor(
    private readonly b3Service: B3Service,
    @InjectQueue('stocks-queue') private readonly stocksQueue: Queue
  ) {
    // Initialize rate limiter with desired configurations.
    this.limiter = new Bottleneck({
      maxConcurrent: 1,  // Only one task at a time
      minTime: 200,      // Minimum delay between tasks
    });
  }

  // Utility function to add jobs to the queue and return a standardized message.
  private async enqueueTask(taskName: string): Promise<string> {
    await this.stocksQueue.add(taskName, {});
    return `${taskName.replace(/-/g, ' ')} Job Added to Queue!`;
  }

  /**
   * Endpoint to enqueue a task to scrape all stocks.
   */
  @Get('enqueue-scrape-all-stocks')
  async enqueueScrapeAllStocks(): Promise<string> {
    return this.enqueueTask('scrape-all-stocks');
  }

  /**
   * Endpoint to enqueue a task to scrape details of all stocks.
   */
  @Get('enqueue-scrape-all-stocks-details')
  async enqueueScrapeAllStocksDetails(): Promise<string> {
    return this.enqueueTask('scrape-all-stocks-details');
  }

  /**
   * Cron job to scrape all stocks at a scheduled time every day.
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async scheduledScrapeAllStocks() {
    await this.limiter.schedule(() => this.b3Service.scrapeAllStocks());
  }

  /**
   * Cron job to scrape details of all stocks at a scheduled time every day.
   */
  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async scheduledScrapeAllStocksDetails() {
    await this.limiter.schedule(() => this.b3Service.scrapeAllStocksDetails());
  }
}
