// src/modules/yahoo/services/yahoo.service.ts

import { YahooHistoryModelDB } from '@/modules/yahoo/models/YahooHistory.model';
import { YahooDividendHistoryModelDB } from '@/modules/yahoo/models/YahooDividendHistory.model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Job } from 'bull';

import LogMethod from '@/app/utils/LogMethod';
import { UpdateYahooStockDividendsService } from '@/modules/yahoo/usecases/update-yahoo-stock-dividends/update-yahoo-stock-dividends.service';
import { UpdateYahooStockHistoryService } from '@/modules/yahoo/usecases/update-yahoo-stock-history/update-yahoo-stock-history.service';
import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';

/**
 * The YahooService class handles the processing of stock-related jobs from the queue.
 * The service is rate-limited to process a maximum of 1000 stock IDs per hour.
 * It leverages the Bottleneck library to ensure the rate limit is respected.
 */
@Processor('stocks-queue') // Update the
@Injectable()
export class YahooService {
  private readonly logger = new Logger(YahooService.name);
  constructor(
    // Usecases
    @Inject(UpdateYahooStockHistoryService)
    private updateYahooStockHistoryService: UpdateYahooStockHistoryService,

    @Inject(UpdateYahooStockDividendsService)
    private updateYahooStockDividendsService: UpdateYahooStockDividendsService,
  ) { }

  @Process({ name: 'scrape_yahoo_history_and_dividends', concurrency: 0 })
  @LogMethod(new Logger(YahooService.name))
  async updateStocks(
    job: Job<number>,
  ): Promise<[YahooHistoryModelDB[], YahooDividendHistoryModelDB[]]> {
    const stockCode = job.data;
    this.logger.log(`About to update stock ${stockCode} history and dividends`);

    try {
      const [history, dividends] = await Promise.all([
        this.updateYahooStockHistoryService.execute([stockCode]),
        this.updateYahooStockDividendsService.execute([stockCode]),
      ]);

      this.logger.log(`Updated stock ${stockCode} history and dividends`);

      // Remove the job when it is completed
      await job.remove();
      this.logger.log(`Removed completed job for stock ${stockCode}`);

      // Sleep for 10 seconds to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 10000));

      return [history, dividends];
    } catch (error) {
      // Find the status code of the error message
      const statusCode = error.message.match(/\d+/g)[0];
      this.logger.error(
        `${statusCode} | Error updating stock ${stockCode} history and dividends`,
      );

      // Remove the job when it is completed
      await job.remove();
      this.logger.log(`Removed completed job for stock ${stockCode}`);

      return [[], []];
    }
  }

  /**
   * Processes the 'scrape_yahoo_history' job by updating the stocks' history.
   *
   * @param {Job<number>} job - The job containing an array of stock IDs to be updated.
   * @returns {Promise<void>} - A promise that resolves when the stocks' history has been updated.
   */
  // @Process({ name: 'scrape_yahoo_history', concurrency: 1 })
  @LogMethod(new Logger(YahooService.name))
  async updateStocksHistory(job: Job<number>): Promise<YahooHistoryModelDB[]> {
    const stockId = job.data;
    this.logger.log(`About to update stock ${stockId} history`);
    return await this.updateYahooStockHistoryService.execute([stockId]);
  }

  /**
   * Processes the 'scrape_yahoo_dividends' job by updating the stocks' dividends.
   *
   * @param {Job<number>} job - The job containing an array of stock IDs to be updated.
   * @returns {Promise<void>} - A promise that resolves when the stocks' dividends have been updated.
   */
  // @Process({ name: 'scrape_yahoo_dividends', concurrency: 1 })
  @LogMethod(new Logger(YahooService.name))
  async updateStocksdividend(
    job: Job<number>,
  ): Promise<YahooDividendHistoryModelDB[]> {
    const stockId = job.data;
    this.logger.log(`About to add stock ${stockId} dividends`);
    return await this.updateYahooStockDividendsService.execute([stockId]);
  }
}
