import { In, Repository } from 'typeorm';

import { StockModelDB } from '@/app/models/Stock.model';
import { YahooDividendHistoryModelDB } from '@/app/models/YahooDividendHistory.model';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UpdateYahooStockDividendsService {
  private readonly logger = new Logger(UpdateYahooStockDividendsService.name);

  constructor(
    @InjectRepository(StockModelDB)
    private stockModelDB: Repository<StockModelDB>,
    @InjectRepository(YahooDividendHistoryModelDB)
    private yahooDividendHistoryModelDB: Repository<YahooDividendHistoryModelDB>,
    @Inject(YahooCrawlerProvider)
    private yahooCrawlerProvider: YahooCrawlerProvider,
  ) {}

  /**
   * Update the Yahoo stock dividends.
   *
   * @param stockCodeList - List of stock codes to update.
   * @returns - Array of updated Yahoo dividend history models.
   */
  async execute(stockCodeList?: number[]): Promise<YahooDividendHistoryModelDB[]> {
    const stocks = await this.stockModelDB.find({
      where: { code: In(stockCodeList || []) },
    });

    if (!stocks.length) {
      this.logger.warn('No stock codes found');
      return [];
    }

    const stocksDividend = await this.updateStockDividends(stocks);

    this.logger.verbose(`Updated ${stocksDividend.length} stock dividend history`);
    return stocksDividend;
  }

  /**
   * Helper function to update and fetch stock dividends.
   *
   * @param stocks - List of stocks to update dividends for.
   * @returns - Array of updated stock dividends.
   */
  private async updateStockDividends(stocks: StockModelDB[]): Promise<YahooDividendHistoryModelDB[]> {
    const dividendsPromises = stocks.map(async stock => {
      const yahooStockDividend = await this.yahooCrawlerProvider.getStockdividend(`${stock.code}.SA`);
      if (!yahooStockDividend) return null;

      const yahooStockDividendSaved = await this.yahooDividendHistoryModelDB.upsert(yahooStockDividend, [
        'stockId',
        'date',
      ]);
      return this.yahooDividendHistoryModelDB.save(yahooStockDividendSaved.generatedMaps);
    });

    const dividends = await Promise.all(dividendsPromises);
    return dividends.flat().filter(Boolean);
  }
}
