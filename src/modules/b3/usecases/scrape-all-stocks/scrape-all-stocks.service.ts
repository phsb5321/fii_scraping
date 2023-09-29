import { Repository } from "typeorm";

import { Stock } from "@/app/entities/Stock/Stock.entity";
import { StockModelDB } from "@/modules/b3/models/Stock.model";
import { B3CrawlerProvider } from "@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/**
 * ScrapeAllStocksService fetches stock data from the B3 Crawler and adds new
 * stocks to the database, returning a list of the newly added stocks.
 *
 * @example
 * const scrapeAllStocksService = new ScrapeAllStocksService(repository, b3Crawler);
 * const newStocks = await scrapeAllStocksService.execute();
 * console.log(newStocks);
 */
@Injectable()
export class ScrapeAllStocksService {
  private readonly logger = new Logger(ScrapeAllStocksService.name);

  constructor(
    @InjectRepository(StockModelDB)
    private readonly stockModelRepository: Repository<StockModelDB>,
    @Inject(B3CrawlerProvider)
    private readonly b3Crawler: B3CrawlerProvider
  ) {}

  /**
   * Fetches stock data from the B3 Crawler, adds new stocks to the database,
   * and returns the newly added stocks.
   *
   * @returns {Promise<StockModelDB[]>} An array of newly added StockModelDB instances.
   */
  async execute(): Promise<StockModelDB[]> {
    const stocks: Stock[] = await this.b3Crawler.getStocks();

    const upsertResult = await this.stockModelRepository.upsert(stocks, [
      "tradingName",
      "issuingCompany",
      "codeCVM",
      "cnpj",
    ]);

    const newStocks = (upsertResult.generatedMaps as StockModelDB[]).filter(
      (stock) => stock !== undefined
    );

    this.logger.verbose(`Found ${newStocks.length} new stocks`);
    return newStocks;
  }
}
