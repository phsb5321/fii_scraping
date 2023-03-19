import { Repository } from 'typeorm';

import { StockI } from '@/app/entities/Stock/Stock.entity';
import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * ScrapeAllStocksService is responsible for fetching stock information from the
 * B3 Crawler, adding new stocks to the database, and returning a list of newly
 * added stocks.
 *
 * @example
 *
 * const scrapeAllStocksService = new ScrapeAllStocksService(repository, b3Crawler);
 * const newStocks = await scrapeAllStocksService.execute();
 * console.log(newStocks);
 */
@Injectable()
export class ScrapeAllStocksService {
  // Create a logger for the ScrapeAllStocksService
  private readonly logger = new Logger(ScrapeAllStocksService.name);

  constructor(
    // Inject the stock model repository for database operations
    @InjectRepository(StockModelDB)
    private stockModelRepository: Repository<StockModelDB>,

    // Inject the B3CrawlerProvider to fetch stock information
    @Inject(B3CrawlerProvider)
    private b3Crawler: B3CrawlerProvider,
  ) { }

  /**
   * Executes the ScrapeAllStocksService to fetch stocks from the B3 Crawler,
   * add new stocks to the database, and return a list of the newly added stocks.
   *
   * @returns {Promise<StockModelDB[]>} A promise that resolves to an array of newly added StockModelDB instances.
   */
  async execute(): Promise<StockModelDB[]> {
    // Fetch the list of stocks from the B3 Crawler
    const stocks: StockI[] = await this.b3Crawler.getStocks();

    // Process each stock in the list and add new stocks to the database
    let newStocks = await this.stockModelRepository
      .upsert(stocks, ['tradingName'])
      .then((result) => {
        // Return the list of new stocks added to the database
        return result.generatedMaps as StockModelDB[];
      });

    newStocks = newStocks.filter((stock) => stock !== undefined);

    // Log the number of new stocks added to the database
    this.logger.verbose(`Found ${newStocks.length} new stocks`);

    // Return the list of new stocks added to the database
    return newStocks;
  }
}
