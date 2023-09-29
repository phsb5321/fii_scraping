import { Repository } from "typeorm";

import { StockModelDB } from "@/modules/b3/models/Stock.model";
import { StockCodeModelDB } from "@/modules/b3/models/StockCode.model";
import { B3CrawlerProvider } from "@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/**
 * UpdateAllStockService is responsible for fetching updated stock information from
 * B3 Crawler and updating the stock information in the database accordingly.
 *
 * @example
 * const updateAllStockService = new UpdateAllStockService(stockRepo, stockCodeRepo, b3Crawler);
 * const updatedStocks = await updateAllStockService.execute();
 * console.log(updatedStocks);
 */
@Injectable()
export class UpdateAllStockService {
  private readonly logger = new Logger(UpdateAllStockService.name);

  constructor(
    @InjectRepository(StockModelDB)
    private readonly stockModelRepository: Repository<StockModelDB>,
    @InjectRepository(StockCodeModelDB)
    private readonly stockCodeModelRepository: Repository<StockCodeModelDB>,
    @Inject(B3CrawlerProvider)
    private readonly b3Crawler: B3CrawlerProvider
  ) {}

  /**
   * Executes the update process to fetch updated stock information from the
   * B3 Crawler and update the stocks in the database.
   *
   * @returns {Promise<StockModelDB[]>} An array of updated StockModelDB instances.
   */
  async execute(): Promise<StockModelDB[]> {
    const stocks = await this.stockModelRepository.find();

    if (stocks.length === 0) {
      this.logger.verbose("No stocks found");
      return [];
    }

    this.logger.verbose(`About to update ${stocks.length} stocks`);

    const stockDetails = await this.b3Crawler.getStockDetails(
      stocks.map((stock) => stock.codeCVM)
    );
    const updatedStocks: StockModelDB[] = [];

    for (const [index, stockDetail] of stockDetails.entries()) {
      const response = await this.updateStock(stocks[index], stockDetail);

      if (stockDetail.otherCodes?.length) {
        await this.updateOtherCodes(stockDetail.otherCodes, response.id);
      }

      updatedStocks.push(response);
    }

    this.logger.log(
      `Updated ${updatedStocks.length} stock(s) in the database.`
    );
    return updatedStocks;
  }

  private async updateStock(
    stock: StockModelDB,
    stockDetail: any
  ): Promise<StockModelDB> {
    return this.stockModelRepository.save({
      ...stock,
      ...stockDetail,
      updatedAt: new Date(),
    });
  }

  private async updateOtherCodes(
    otherCodes: any[],
    stockId: number
  ): Promise<void> {
    const otherCodesList = otherCodes.map((code) => ({
      ...code,
      stock: { id: stockId },
    }));

    await this.stockCodeModelRepository.upsert(otherCodesList, ["code"]);
  }
}
