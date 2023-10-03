import { YahooDividendEntity } from '@/app/entities/Dividend/Dividend.entity';
import { PrismaService } from '@/app/infra/prisma/prisma.service';
import { BatchProcessorService } from '@/app/utils/batch-processor/batch-processor.service';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { YahooDividendHistory, YahooHistory } from '@prisma/client';

export interface MinimalStock {
  id: number;
  code: string;
}

@Injectable()
export class ExtractStockHistoryService {
  private readonly logger = new Logger(ExtractStockHistoryService.name);

  // Define default configurations
  private readonly REQUESTS_LIMIT = 100;
  private readonly BATCH_SIZE = 10;
  private readonly TIME_FRAME_MULTIPLIER = 1 * 60 * 1000; // 1 minute

  constructor(
    private readonly prisma: PrismaService,
    @Inject(YahooCrawlerProvider)
    private readonly yahooCrawlerProvider: YahooCrawlerProvider,
    private readonly batchProcessorService: BatchProcessorService,
  ) {}

  /**
   * Entry point for the service. It fetches stocks, processes them, and returns updated histories and dividends.
   */
  async execute(): Promise<[YahooHistory[], YahooDividendHistory[]]> {
    // Fetch stocks with defined codes
    const stocks = await this.prisma.stock.findMany({
      select: { id: true, code: true },
    });

    if (stocks.length === 0) {
      this.logger.warn('No stock codes found');
      return [[], []];
    }

    // Update stock histories and dividends in batches
    await this.batchProcessorService.executeInBatches(
      stocks,
      this.updateStocks.bind(this),
      this.REQUESTS_LIMIT,
      this.BATCH_SIZE,
      this.TIME_FRAME_MULTIPLIER,
    );

    // Fetch and return updated histories and dividends
    return this.fetchUpdatedHistoriesAndDividends(stocks);
  }

  /**
   * Updates both stock histories and dividends for a given batch of stocks.
   */
  private async updateStocks(stockBatch: MinimalStock[]): Promise<void> {
    await Promise.all([
      this.updateStockHistories(stockBatch),
      // this.updateStockDividends(stockBatch)
    ]);
  }

  /**
   * Updates stock histories for a given list of stocks.
   */
  private async updateStockHistories(stocks: MinimalStock[]): Promise<void> {
    for (const stock of stocks) {
      try {
        const stockData = await this.yahooCrawlerProvider.getStockTradeHistory(`${stock.code}.SA`);
        if (!stockData) continue;

        for (const item of stockData) {
          // Upsert the data into the database
          await this.prisma.yahooHistory.upsert({
            where: { stockId_date: { stockId: stock.id, date: item.date } },
            update: { ...item, stockId: stock.id },
            create: { ...item, stockId: stock.id },
          });
        }
      } catch (error) {
        this.logger.error(`Failed to update data for ${stock.code}: ${error.message}`);
      }
    }
  }

  /**
   * Updates stock dividends for a given list of stocks.
   */
  private async updateStockDividends(stocks: MinimalStock[]): Promise<void> {
    for (const stock of stocks) {
      try {
        const stockData: YahooDividendEntity[] = await this.yahooCrawlerProvider.getStockdividend(`${stock.code}.SA`);
        if (!stockData) continue;

        for (const item of stockData) {
          // Upsert the data into the database
          await this.prisma.yahooDividendHistory.upsert({
            where: { stockId_date: { stockId: stock.id, date: item.date } },
            update: { ...item, stockId: stock.id },
            create: { ...item, stockId: stock.id } as unknown as YahooDividendHistory,
          });
        }
      } catch (error) {
        this.logger.error(`Failed to update data for ${stock.code}: ${error.message}`);
      }
    }
  }

  /**
   * Fetches updated histories and dividends for a given list of stocks.
   */
  private async fetchUpdatedHistoriesAndDividends(
    stocks: MinimalStock[],
  ): Promise<[YahooHistory[], YahooDividendHistory[]]> {
    const stockIds = stocks.map(stock => stock.id);
    const histories = await this.prisma.yahooHistory.findMany({
      where: { stockId: { in: stockIds } },
    });

    const dividends = await this.prisma.yahooDividendHistory.findMany({
      where: { stockId: { in: stockIds } },
    });

    return [histories, dividends];
  }
}
