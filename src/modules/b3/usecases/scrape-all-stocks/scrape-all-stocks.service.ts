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

    // If no new stocks are found, log the message and return an empty array
    if (!stocks || stocks.length === 0) {
      this.logger.verbose('No new stocks found');
      return [];
    }

    // Initialize the count of new stocks added to the database
    let newStocksCount = 0;

    // Process each stock in the list and add new stocks to the database
    const newStocks = await Promise.all(
      stocks.map(async (stock) => {
        // Search for an existing stock in the database by issuing company
        const existingStock = await this.stockModelRepository.findOne({
          where: { issuingCompany: stock.issuingCompany },
        });

        // If the stock already exists, skip it
        if (existingStock) return;

        // Create a new stock record in the database
        const newStock = await this.stockModelRepository.create(stock);
        newStocksCount++; // Increment the count of new stocks

        // Save the new stock record to the database
        return await this.stockModelRepository.save(newStock);
      }),
    );

    // Log the number of new stocks added to the database
    this.logger.verbose(`Found ${newStocksCount} new stocks`);

    // Return the list of new stocks added to the database
    return newStocks;
  }
}
