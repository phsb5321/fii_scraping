// src/modules/b3/services/b3.service.ts

// Libs
import { Job, Queue } from 'bull';

// Cron Configs
import {
  CRON_TIME_EVERY_5_MINUTES,
  CRON_TIME_EVERY_5_SECONDS,
} from '@/app/utils/CronConfigs';

// Logger
import LogMethod from '@/app/utils/LogMethod';

// Database Models
import { StockModelDB } from '@/modules/b3/models/Stock.model';

// Services
import { ScrapeAllStocksService } from '@/modules/b3/usecases/scrape-all-stocks/scrape-all-stocks.service';
import { UpdateAllStockService } from '@/modules/b3/usecases/update-all-stock/update-all-stock.service';
import { ListAllStocksService } from '@/modules/b3/usecases/list-all-stocks/list-all-stocks.service';

// Nest Modules
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
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
export class B3Service implements OnModuleInit {
  logger = new Logger(B3Service.name);

  constructor(
    // Services
    @Inject(ScrapeAllStocksService)
    private scrapeAllStocksService: ScrapeAllStocksService,

    @Inject(UpdateAllStockService)
    private updateAllStockService: UpdateAllStockService,

    @Inject(ListAllStocksService)
    private listAllStocksService: ListAllStocksService,

    // Queues
    @InjectQueue('stocks-queue')
    private stocksQueue: Queue,
  ) { }

  async onModuleInit(): Promise<void> {
    this.stocksQueue.pause(); // Pause the queue on initialization

    // Listen to the 'global:completed' event and resume the queue
    this.stocksQueue.on('global:completed', async () => {
      await this.stocksQueue.resume();
    });

    // Listen to the 'global:active' event and pause the queue
    this.stocksQueue.on('global:active', async () => {
      await this.stocksQueue.pause();
    });
  }

  // @Cron(CRON_TIME_EVERY_5_SECONDS)
  async checkForJobs(): Promise<void> {
    const jobCount = await this.stocksQueue.getJobCounts();

    if (
      jobCount.waiting > 0 ||
      jobCount.active > 0 ||
      jobCount.delayed > 0 ||
      jobCount.failed > 0
    ) {
      const isQueuePaused = await this.stocksQueue.isPaused();

      if (isQueuePaused) {
        await this.stocksQueue.resume();
        this.logger.verbose(`Queue resumed.`);
      }
    } else this.logger.verbose(`No jobs to work on.`);
  }

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
    try {
      const scrapedStocksDetails = await this.updateAllStockService.execute();
      this.logger.verbose(
        `Scraping details for ${scrapedStocksDetails.length} stocks`,
      );

      if (!scrapedStocksDetails || scrapedStocksDetails.length === 0) return [];

      const stockCodeList = scrapedStocksDetails
        .map((stock) => stock.code)
        .filter((code) => code);

      await Promise.all(
        stockCodeList.map(async (stockCode) => {
          this.stocksQueue.add(`scrape_yahoo_history_and_dividends`, stockCode);
        }),
      );

      this.logger.verbose(`Added ${scrapedStocksDetails.length} stocks `);

      return scrapedStocksDetails;
    } catch (error) {
      this.logger.error(error);
      throw { ...error, job: job.data };
    }
  }

  async create_jobs_for_all_stocks(): Promise<void> {
    await this.stocksQueue.add(`scrape_details`);

    // const stockList = await this.listAllStocksService.execute();
    // // Filter out stocks that don't have a code
    // const stockCodeList = stockList
    //   .map((stock) => stock.code)
    //   .filter((code) => code);

    // await Promise.all(
    //   stockCodeList.map(async (stockCode) => {
    //     this.stocksQueue.add(`scrape_yahoo_history_and_dividends`, stockCode);
    //   }),
    // );
    return Promise.resolve();
  }
}
