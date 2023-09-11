import { In, Repository } from 'typeorm';

import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { YahooHistoryModelDB } from '@/modules/yahoo/models/YahooHistory.model';
import {
  YahooCrawlerProvider
} from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UpdateYahooStockHistoryService {
  private readonly logger = new Logger(UpdateYahooStockHistoryService.name);

  constructor(
    @InjectRepository(YahooHistoryModelDB)
    private readonly yahooHistoryModelDB: Repository<YahooHistoryModelDB>,

    @InjectRepository(StockModelDB)
    private readonly stockModelDB: Repository<StockModelDB>,

    @Inject(YahooCrawlerProvider)
    private readonly yahooCrawlerProvider: YahooCrawlerProvider,
  ) { }

  /**
   * Executes the service, updating stock history for specific or all stocks.
   * 
   * @param stockCodeList - (Optional) Array of stock codes to update.
   * @returns Updated stock history data.
   */
  async execute(stockCodeList?: number[]): Promise<YahooHistoryModelDB[]> {
    const stocks = await this.stockModelDB.find({ where: { code: In(stockCodeList || []) } });

    if (!stocks.length) {
      this.logger.warn('No stock codes found');
      return [];
    }

    const stocksHistory = await this.fetchAndSaveStockHistories(stocks);

    this.logger.verbose(`Saved ${stocksHistory.length} stock history records`);
    return stocksHistory;
  }

  /**
   * Fetches stock histories from Yahoo and saves them.
   * 
   * @param stocks - List of stocks to fetch histories for.
   * @returns Array of updated stock histories.
   */
  private async fetchAndSaveStockHistories(stocks: StockModelDB[]): Promise<YahooHistoryModelDB[]> {
    const historiesPromises = stocks.map(async stock => {
      const YahooStockHistory = await this.yahooCrawlerProvider.getStockTradeHistory(`${stock.code}.SA`);

      if (!YahooStockHistory || YahooStockHistory.length === 0) return null;

      this.logger.verbose(`Stock ${stock.code}.SA has ${YahooStockHistory.length} days of history`);

      const sortedStockHistory = this.stableSort(YahooStockHistory, (a, b) => {
        if (!a.date || !b.date) return 0;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });

      const savedHistory = await this.yahooHistoryModelDB.upsert(sortedStockHistory, ['stockId', 'date']);
      return this.yahooHistoryModelDB.save(savedHistory.generatedMaps);
    });

    const histories = await Promise.all(historiesPromises);
    return histories.flat().filter(Boolean);
  }

  /**
 * Stable sorts an array based on the provided comparator.
 * 
 * @param arr - The array to be sorted.
 * @param comparator - Comparator function for sorting.
 * @returns A new sorted array.
 */
  private stableSort<T>(arr: T[], comparator: (a: T, b: T) => number): T[] {
    const indexedArr = arr.map((elem, index) => ({ elem, index }));
    indexedArr.sort((a, b) => {
      const cmp = comparator(a.elem, b.elem);
      return cmp !== 0 ? cmp : a.index - b.index;
    });
    return indexedArr.map(({ elem }) => elem);
  }

}
