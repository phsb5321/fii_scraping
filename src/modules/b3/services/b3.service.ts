import { StockModelDB } from '@/modules/b3/models/Stock.model';
import {
  ScrapeAllStocksService
} from '@/modules/b3/usecases/scrape-all-stocks/scrape-all-stocks.service';
import {
  UpdateAllStockService
} from '@/modules/b3/usecases/update-all-stock/update-all-stock.service';
import { Process, Processor } from '@nestjs/bull';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Job } from 'bull';

/**
 * The B3Service class manages and processes stock data. It handles operations
 * like scraping stock details, updating stock data, and processing stock history.
 */
@Processor('stocks-queue')
@Injectable()
export class B3Service implements OnModuleInit {
  private logger = new Logger(B3Service.name);

  constructor(
    private scrapeAllStocksService: ScrapeAllStocksService,
    private updateAllStockService: UpdateAllStockService,
  ) { }

  /**
   * Called when the module is initialized.
   */
  async onModuleInit(): Promise<void> {
    this.logger.verbose(`B3Service initialized.`);
  }

  /**
   * Scrapes all stocks and logs the amount scraped.
   * @returns {Promise<StockModelDB[]>} The list of scraped stocks.
   */
  async scrapeAllStocks(): Promise<StockModelDB[]> {
    const scrapedStocks = await this.scrapeAllStocksService.execute();
    return scrapedStocks;
  }

  /**
   * Updates details for all stocks and logs the process.
   * @returns {Promise<StockModelDB[]>} - The updated stocks list.
   */
  async scrapeAllStocksDetails(): Promise<StockModelDB[]> {
    try {
      const scrapedStocksDetails = await this.updateAllStockService.execute();
      this.logger.verbose(`Updated details for ${scrapedStocksDetails.length} stocks`);
      return scrapedStocksDetails;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw error;
    }
  }

  @Process('scrape-all-stocks')
  async handleScrapeAllStocks(job: Job): Promise<void> {
    try {
      await this.scrapeAllStocks();
      this.logger.verbose(`Handled scrapeAllStocks job ${job.id}`);
    } catch (error) {
      this.logger.error(`Error in scrapeAllStocks job ${job.id}`, error.stack);
      throw error;
    }
  }

  @Process('scrape-all-stocks-details')
  async handleScrapeAllStocksDetails(job: Job): Promise<void> {
    try {
      await this.scrapeAllStocksDetails();
      this.logger.verbose(`Handled scrapeAllStocksDetails job ${job.id}`);
    } catch (error) {
      this.logger.error(`Error in scrapeAllStocksDetails job ${job.id}`, error.stack);
      throw error;
    }
  }
}
