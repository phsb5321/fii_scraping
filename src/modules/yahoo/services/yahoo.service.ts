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
@Processor('stocks-queue')
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

  /**
   * Processes the 'scrape_yahoo_history' job by updating the stocks' history.
   *
   * @param {Job<number[]>} job - The job containing an array of stock IDs to be updated.
   * @returns {Promise<void>} - A promise that resolves when the stocks' history has been updated.
   */
  @Process('scrape_yahoo_history')
  @LogMethod(new Logger(YahooService.name))
  async updateStocksHistory(job: Job<number[]>) {
    const stockId = job.data;
    this.logger.log(`About to update stock ${stockId.length} history`);

    // Break the list of stock IDs into chunks of 20
    const stockIdChunks = await this.chunkArray(stockId, 20);

    // Each 10 seconds, process the next chunk of stock IDs
    for (const stockIdChunk of stockIdChunks) {
      await this.updateYahooStockHistoryService.execute(stockIdChunk);
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  /**
   * Processes the 'scrape_yahoo_dividends' job by updating the stocks' dividends.
   *
   * @param {Job<number[]>} job - The job containing an array of stock IDs to be updated.
   * @returns {Promise<void>} - A promise that resolves when the stocks' dividends have been updated.
   */
  @Process('scrape_yahoo_dividends')
  @LogMethod(new Logger(YahooService.name))
  async updateStocksdividend(job: Job<number[]>) {
    const stockId = job.data;
    this.logger.log(`Adding stock ${stockId.length} dividends`);

    // Break the list of stock IDs into chunks of 20
    const stockIdChunks = await this.chunkArray(stockId, 20);

    // Each 10 seconds, process the next chunk of stock IDs
    for (const stockIdChunk of stockIdChunks) {
      await this.updateYahooStockDividendsService.execute(stockIdChunk);
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }
  }

  private async chunkArray<T>(array: T[], chunkSize: number): Promise<T[][]> {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunkedArray.push(array.slice(i, i + chunkSize));
    }
    return chunkedArray;
  }
}
