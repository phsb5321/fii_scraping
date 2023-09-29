import { Job } from "bull";

import LogMethod from "@/app/utils/LogMethod";
import { YahooDividendHistoryModelDB } from "@/modules/yahoo/models/YahooDividendHistory.model";
import { YahooHistoryModelDB } from "@/modules/yahoo/models/YahooHistory.model";
import { UpdateYahooStockDividendsService } from "@/modules/yahoo/usecases/update-yahoo-stock-dividends/update-yahoo-stock-dividends.service";
import { UpdateYahooStockHistoryService } from "@/modules/yahoo/usecases/update-yahoo-stock-history/update-yahoo-stock-history.service";
import { Process } from "@nestjs/bull";
import { Injectable, Logger } from "@nestjs/common";

/**
 * Service responsible for managing and updating Yahoo stock data.
 */
@Injectable()
export class YahooService {
  private readonly logger = new Logger(YahooService.name);

  constructor(
    private readonly updateStockHistorySvc: UpdateYahooStockHistoryService,
    private readonly updateStockDividendsSvc: UpdateYahooStockDividendsService
  ) {}

  /**
   * Update stock's history and dividends.
   *
   * @param stockCode The stock code for the update.
   * @returns Updated history and dividends data.
   */
  @LogMethod(new Logger(YahooService.name))
  async updateStocks(
    stockCode: number
  ): Promise<[YahooHistoryModelDB[], YahooDividendHistoryModelDB[]]> {
    try {
      return await Promise.all([
        this.updateStockHistorySvc.execute([stockCode]),
        this.updateStockDividendsSvc.execute([stockCode]),
      ]);
    } catch (error) {
      const statusCode = error.message.match(/\d+/g)?.[0] || "Unknown";
      this.logger.error(`${statusCode} | Error updating stock ${stockCode}`);
      return [[], []];
    }
  }

  /**
   * Handle Bull queue job for updating a Yahoo stock.
   *
   * @param job The Bull job instance.
   */
  @Process("update-yahoo-stock")
  async handleUpdateYahooStock(job: Job<{ stockCode: number }>): Promise<void> {
    try {
      await this.updateStocks(job.data.stockCode);
      this.logger.verbose(
        `Handled job ${job.id} for stock ${job.data.stockCode}`
      );
    } catch (error) {
      this.logger.error(
        `Error in job ${job.id} for stock ${job.data.stockCode}`,
        error.stack
      );
      throw error;
    }
  }
}
