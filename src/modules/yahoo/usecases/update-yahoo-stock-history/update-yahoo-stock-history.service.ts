// src/modules/yahoo/usecases/update-yahoo-stock-history/update-yahoo-stock-history.service.ts

import { In, Repository } from 'typeorm';

import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { YahooHistoryModelDB } from '@/modules/yahoo/models/YahooHistory.model';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { Processor } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

/**
 * UpdateYahooStockHistoryService is a class responsible for updating the stock history
 * using data from Yahoo Finance. It fetches the stock history and saves it to the database.
 * This service can be executed for specific stocks or all stocks in the database.
 */
@Processor('stocks-queue')
@Injectable()
export class UpdateYahooStockHistoryService {
  private readonly logger = new Logger(UpdateYahooStockHistoryService.name);

  constructor(
    @InjectRepository(YahooHistoryModelDB)
    private yahooHistoryModelDB: Repository<YahooHistoryModelDB>,

    @InjectRepository(StockModelDB)
    private stockModelDB: Repository<StockModelDB>,

    @Inject(YahooCrawlerProvider)
    private yahooCrawlerProvider: YahooCrawlerProvider,
  ) { }

  /**
   * Executes the service to update the stock history for the specified stocks or all stocks.
   * @param {number[] | undefined} stockCodeLIst - Optional array of stock IDs to update.
   * @returns {Promise<YahooHistoryModelDB[]>} The updated stock history data.
   */
  async execute(stockCodeLIst: number[]): Promise<YahooHistoryModelDB[]> {
    // Find stock codes for the specified stocks or all stocks
    const stocks = await this.stockModelDB.find({
      where: { code: In(stockCodeLIst) },
    });

    if (!stocks.length) {
      this.logger.warn('No stock codes found');
      return [];
    }

    // Fetch stock history for each stock code and save it to the database
    const stocksHistory = await Promise.all(
      stocks.map(async ({ code }) => {
        const stockDotSa = code + '.SA';

        // Fetch stock history from Yahoo Finance
        const yahooStockHistory =
          await this.yahooCrawlerProvider.getStockTradeHistory(stockDotSa);

        if (!yahooStockHistory) return [];

        // Log the length of the stock history
        this.logger.verbose(
          `Stock ${stockDotSa} has ${yahooStockHistory.length} days of history`,
        );

        // Sort the stock history by date
        yahooStockHistory.sort((a, b) => {
          if (a.date > b.date) return 1;
          if (a.date < b.date) return -1;
          return 0;
        });

        // Save the stock history to the database
        const yahooStockHistorySaved = await this.yahooHistoryModelDB.upsert(
          yahooStockHistory,
          ['stockId', 'date'],
        );

        return (await this.yahooHistoryModelDB.save(
          yahooStockHistorySaved.generatedMaps,
        )) as YahooHistoryModelDB[];
      }),
    );

    // Log the number of stock history records saved
    this.logger.verbose(
      `Saved ${stocksHistory.flat().length} stock history records`,
    );

    return stocksHistory.flat();
  }
}
