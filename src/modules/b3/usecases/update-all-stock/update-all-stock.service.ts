import { Repository } from 'typeorm';

import { StockI } from '@/app/entities/Stock/Stock.entity';
import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * UpdateAllStockService is responsible for updating stock details in the
 * database by fetching the latest information from the B3 Crawler.
 *
 * @example
 *
 * const updateAllStockService = new UpdateAllStockService(repository, b3Crawler);
 * const updatedStocks = await updateAllStockService.execute();
 * console.log(updatedStocks);
 */
@Injectable()
export class UpdateAllStockService {
  private readonly logger = new Logger(UpdateAllStockService.name);

  constructor(
    // Repositories
    @InjectRepository(StockModelDB)
    private stockModelRepository: Repository<StockModelDB>,

    // Providers
    @Inject(B3CrawlerProvider)
    private b3Crawler: B3CrawlerProvider,
  ) { }

  /**
   * Executes the UpdateAllStockService to update stock details in the database
   * by fetching the latest information from the B3 Crawler.
   *
   * @returns {Promise<StockModelDB[]>} A promise that resolves to an array of updated StockModelDB instances.
   */
  async execute(): Promise<StockModelDB[]> {
    // Find all stocks in the database and order them by their update date
    const stocks: StockI[] = await this.stockModelRepository.find({
      order: { updatedAt: 'ASC' },
      take: 1000,
    });

    // Initialize a count for updated stocks
    let updatedStocksCount = 0;

    // Use a web crawler to get the details of each stock
    const stockDetails = await Promise.all(
      await this.b3Crawler.getStockDetails(
        stocks.map((stock) => stock.codeCVM),
      ),
    );

    // Update the details of each stock
    const updatedStocks = await Promise.all(
      stockDetails.map(async (stockDetail, index) => {
        // Save the updated details to the database
        const response = await this.stockModelRepository.save({
          ...stocks[index],
          ...stockDetail,
          updatedAt: new Date(),
        });

        // Save any new other codes to the database
        const { otherCodes } = stockDetail;

        if (!otherCodes || otherCodes.length === 0) return response;

        return response as StockModelDB;
      }),
    );

    // Increment the count of updated stocks
    updatedStocksCount += updatedStocks.length;

    // Log the number of stocks updated
    this.logger.verbose(`Updated ${updatedStocksCount} stocks`);

    return updatedStocks;
  }
}
