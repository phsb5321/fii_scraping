import { IsNull, Not, Repository } from "typeorm";

import {
  StockCodeModelDB,
  StockModelDB,
  YahooDividendHistoryModelDB,
  YahooHistoryModelDB,
} from "@/app/models";
import { YahooCrawlerProvider } from "@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/**
 * @class ExtractStockHistoryService
 * Service responsible for extracting and updating stock history and dividends
 */
@Injectable()
export class ExtractStockHistoryService {
  private readonly logger = new Logger(ExtractStockHistoryService.name);
  private readonly REQUESTS_LIMIT = 100;
  private readonly BATCH_SIZE = 10;
  private readonly TIME_FRAME_MULTIPLIER = 1 * 60 * 1000; // 30 minutes in milliseconds

  constructor(
    @InjectRepository(StockModelDB)
    private readonly stockModelDB: Repository<StockModelDB>,
    @InjectRepository(StockCodeModelDB)
    private readonly stockCodeModelDB: Repository<StockCodeModelDB>,
    @InjectRepository(YahooDividendHistoryModelDB)
    private readonly yahooDividendHistoryModelDB: Repository<YahooDividendHistoryModelDB>,
    @InjectRepository(YahooHistoryModelDB)
    private readonly yahooHistoryModelDB: Repository<YahooHistoryModelDB>,
    @Inject(YahooCrawlerProvider)
    private readonly yahooCrawlerProvider: YahooCrawlerProvider,
  ) {}

  /**
   * Executes the service, updating both stock history and dividends for specific or all stocks.
   * @returns Tuple containing arrays of updated stock history and dividend models.
   */
  async execute(): Promise<
    [YahooHistoryModelDB[], YahooDividendHistoryModelDB[]]
  > {
    const stocks = await this.stockModelDB.find({
      where: { code: Not(IsNull()) },
      select: ["id", "code"],
    });
    if (stocks.length === 0) {
      this.logger.warn("No stock codes found");
      return [[], []];
    }

    await this.processStocksInBatches(stocks);
    return this.fetchUpdatedHistoriesAndDividends(stocks);
  }

  private async processStocksInBatches(stocks: StockModelDB[]): Promise<void> {
    const timeBetweenRequests =
      ((stocks.length / this.REQUESTS_LIMIT) * this.TIME_FRAME_MULTIPLIER) /
      Math.ceil(stocks.length / this.BATCH_SIZE);

    this.logger.verbose(
      `The process will take approximately ${(
        (timeBetweenRequests * Math.ceil(stocks.length / this.BATCH_SIZE)) /
        (60 * 1000)
      ).toFixed(2)} minutes`,
    );

    for (let i = 0; i < stocks.length; i += this.BATCH_SIZE)
      await this.updateStocks(
        stocks.slice(i, i + this.BATCH_SIZE),
        timeBetweenRequests,
        i,
        Math.ceil(stocks.length / this.BATCH_SIZE),
      );
  }

  private async updateStocks(
    stockBatch: StockModelDB[],
    timeBetweenRequests: number,
    i: number,
    totalBatches: number,
  ): Promise<void> {
    try {
      await Promise.all([
        this.updateStockHistories(stockBatch),
        this.updateStockDividends(stockBatch),
      ]);

      await this.delay(timeBetweenRequests);

      this.logger.verbose(
        `Processed batch ${i / this.BATCH_SIZE + 1} of ${totalBatches}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process batch ${
          i / this.BATCH_SIZE + 1
        } of ${totalBatches}: ${error.message}`,
      );
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async updateStockHistories(stocks: StockModelDB[]): Promise<void> {
    await Promise.all(
      stocks.map(async (stock) => {
        try {
          const yahooStockHistory =
            await this.yahooCrawlerProvider.getStockTradeHistory(
              `${stock.code}.SA`,
            );

          if (!yahooStockHistory || yahooStockHistory.length === 0) return;

          // Map over yahooStockHistory and add stockId to each item
          const historyWithStockId = yahooStockHistory.map((item) => ({
            ...item,
            stockId: stock.id, // Relate stock.id from the stock array to the stockId.
          }));

          const { generatedMaps } = await this.yahooHistoryModelDB.upsert(
            this.stableSort(
              historyWithStockId,
              (a, b) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0),
            ),
            ["stockId", "date"],
          );

          await this.yahooHistoryModelDB.save(generatedMaps);
        } catch (error) {
          this.logger.error(
            `Failed to update history for ${stock.code}: ${error.message}`,
          );
        }
      }),
    );
  }

  private async updateStockDividends(stocks: StockModelDB[]): Promise<void> {
    await Promise.all(
      stocks.map(async (stock) => {
        try {
          const yahooStockDividend =
            await this.yahooCrawlerProvider.getStockdividend(
              `${stock.code}.SA`,
            );

          if (!yahooStockDividend) return;

          // If yahooStockDividend is an array, map over it and add stockId to each item
          // If it's a single object, add stockId property directly to it
          const dividendWithStockId = yahooStockDividend.map((dividend) => ({
            ...dividend,
            stockId: stock.id,
          }));

          const { generatedMaps } =
            await this.yahooDividendHistoryModelDB.upsert(dividendWithStockId, [
              "stockId",
              "date",
            ]);

          await this.yahooDividendHistoryModelDB.save(generatedMaps);
        } catch (error) {
          this.logger.error(
            `Failed to update dividends for ${stock.code}: ${error.message}`,
          );
        }
      }),
    );
  }

  private async fetchUpdatedHistoriesAndDividends(
    stocks: StockModelDB[],
  ): Promise<[YahooHistoryModelDB[], YahooDividendHistoryModelDB[]]> {
    const stockIds = stocks.map((stock) => stock.id);

    const [histories, dividends] = await Promise.all([
      this.yahooHistoryModelDB
        .createQueryBuilder("history")
        .innerJoin("history.stock", "stock")
        .where("stock.id IN (:...stockIds)", { stockIds })
        .getMany(),

      this.yahooDividendHistoryModelDB
        .createQueryBuilder("dividendHistory")
        .innerJoin("dividendHistory.stock", "stock")
        .where("stock.id IN (:...stockIds)", { stockIds })
        .getMany(),
    ]);

    return [histories, dividends];
  }

  private stableSort<T>(arr: T[], comparator: (a: T, b: T) => number): T[] {
    return arr
      .map((elem, index) => ({ elem, index }))
      .sort((a, b) => comparator(a.elem, b.elem) || a.index - b.index)
      .map(({ elem }) => elem);
  }
}
