// Libs
import { Job, Queue } from 'bull';

// Cron Configs
import { CRON_TIME_EVERY_5_MINUTES } from '@/app/utils/CronConfigs';

// Logger
import LogMethod from '@/app/utils/LogMethod';

// Database Models
import { StockModelDB } from '@/modules/b3/models/Stock.model';

// Services
import { ScrapeAllStocksService } from '@/modules/b3/usecases/scrape-all-stocks/scrape-all-stocks.service';
import { ScrapeB3HistoryService } from '@/modules/b3/usecases/scrape-b3-history/scrape-b3-history.service';
import { UpdateAllStockService } from '@/modules/b3/usecases/update-all-stock/update-all-stock.service';

// Nest Modules
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

/**
 * The B3Service class is responsible for managing and processing stock data,
 * including scraping stocks, updating stock information, and processing historical stock data.
 *
 * The class uses NestJS modules, including the '@nestjs/bull' package for queue processing
 * and the '@nestjs/schedule' package for scheduling tasks.
 */
@Injectable()
@Processor('stocks-queue')
export class B3Service {
  logger = new Logger(B3Service.name);

  constructor(
    // Services
    @Inject(ScrapeAllStocksService)
    private scrapeAllStocksService: ScrapeAllStocksService,

    @Inject(UpdateAllStockService)
    private updateAllStockService: UpdateAllStockService,

    @Inject(ScrapeB3HistoryService)
    private scrapeB3HistoryService: ScrapeB3HistoryService,

    // Queues
    @InjectQueue('stocks-queue')
    private stocksQueue: Queue,
  ) { }

  /**
   * Periodically scrapes all stocks and adds them to the stocks queue for further processing.
   * This method is scheduled to run every 5 minutes.
   *
   * @returns {Promise<StockModelDB[]>} The list of newly scraped stocks.
   */
  // @Cron(CRON_TIME_EVERY_5_MINUTES)
  @LogMethod(new Logger(B3Service.name))
  async scrape_all_stocks(): Promise<StockModelDB[]> {
    // Execute the ScrapeAllStocksService to get the list of scraped stocks
    const scrapedStocks = await this.scrapeAllStocksService.execute();

    const stockIdList = scrapedStocks
      .filter((stock) => stock.id)
      .map((stock) => stock.id);

    this.stocksQueue.add(`scrape_details`, stockIdList);
    this.logger.verbose(`Added ${scrapedStocks.length} stocks`);

    // Return the list of scraped stocks
    return scrapedStocks;
  }

  /**
   * Processes the 'scrape_details' job by updating all stocks with their latest information.
   *
   * @param {Job<number[]>} job - The job containing an array of stock IDs to be updated.
   * @returns {Promise<StockModelDB[]>} - A promise that resolves when the stocks have been updated.
   */
  @Process('scrape_details')
  @LogMethod(new Logger(B3Service.name))
  async scrape_all_stocks_details(job: Job<number[]>): Promise<StockModelDB[]> {
    const stockIdList = job.data;
    const scrapedStocksDetails = await this.updateAllStockService.execute(
      stockIdList,
    );

    if (!scrapedStocksDetails || scrapedStocksDetails.length === 0) return [];

    this.logger.verbose(`Scraped ${scrapedStocksDetails.length} stocks`);

    const stockIdListDetails = scrapedStocksDetails
      .filter((stock) => stock.id !== null)
      .map((stock) => stock.id);

    this.stocksQueue.add(`scrape_yahoo_history`, stockIdListDetails);
    this.stocksQueue.add(`scrape_yahoo_dividends`, stockIdListDetails);
    this.logger.verbose(`Added ${scrapedStocksDetails.length} stocks `);

    return scrapedStocksDetails;
  }

  /**
   * Scrapes historical stock data from the B3 website.
   * This method is currently commented out and not scheduled to run.
   *
   * @returns {Promise<void>} A promise that resolves when the historical stock data has been scraped.
   */
  async scrape_b3_history(): Promise<void> {
    return this.scrapeB3HistoryService.execute();
  }
}
