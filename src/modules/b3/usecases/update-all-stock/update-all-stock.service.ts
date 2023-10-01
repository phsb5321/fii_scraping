import { Repository } from "typeorm";

import { OtherCode, Stock } from "@/app/entities/Stock/Stock.entity";
import { StockModelDB } from "@/app/models/Stock.model";
import { StockCodeModelDB } from "@/app/models/StockCode.model";
import { B3CrawlerProvider } from "@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

/**
 * Service responsible for updating all stocks. It fetches updated stock information from
 * B3 Crawler and updates the stock information in the database accordingly.
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
    private readonly b3Crawler: B3CrawlerProvider,
  ) {}

  /**
   * Executes the update service. It fetches and updates stock details in the database.
   * @returns An array of updated StockModelDB instances.
   */
  async execute(): Promise<StockModelDB[]> {
    const stocks = await this.stockModelRepository.find({
      select: ["codeCVM"],
    });
    if (!stocks.length) {
      this.logger.verbose("No stocks found");
      return [];
    }
    this.logger.verbose(`Updating ${stocks.length} stocks`);
    await this.processStocksInBatches(stocks.map((stock) => +stock.codeCVM));
    return this.stockModelRepository.find();
  }

  private async processStocksInBatches(stockCodes: number[]): Promise<void> {
    const [requestsLimit, batchSize] = [200, 100];
    const timeFrame = (stockCodes.length / requestsLimit) * 0.5 * 60 * 1000; // 1 minute
    const timeBetweenRequests =
      timeFrame / Math.ceil(stockCodes.length / batchSize);

    const totalBatches = Math.ceil(stockCodes.length / batchSize);

    // Calculate total time and log it
    const totalTimeInMs = timeBetweenRequests * totalBatches;
    const totalTimeInMin = totalTimeInMs / (60 * 1000); // Convert ms to minutes
    this.logger.verbose(
      `The process will take approximately ${totalTimeInMin.toFixed(
        2,
      )} minutes`,
    );

    for (let i = 0; i < stockCodes.length; i += batchSize) {
      const batch = stockCodes.slice(i, i + batchSize);

      // Log the progress at each step
      this.logger.verbose(
        `Processing batch ${i / batchSize + 1} of ${totalBatches}`,
      );

      await this.delay(timeBetweenRequests);
      await this.processBatch(batch);

      // Log completion of the batch
      this.logger.verbose(
        `Completed batch ${i / batchSize + 1} of ${totalBatches}`,
      );

      if (i / batchSize + 1 === totalBatches)
        this.logger.verbose("All batches have been processed");
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async processBatch(batch: number[]): Promise<void> {
    try {
      const stockDetails = await this.fetchStockDetails(batch);
      await Promise.all(
        stockDetails.map((stockDetail, index) =>
          this.processStock(batch[index], stockDetail),
        ),
      );
    } catch (error) {
      this.logger.error(
        `Error processing batch: ${error.message}`,
        error.stack,
      );
    }
  }

  private async processStock(
    stockCode: number,
    stockDetail: Partial<Stock>,
  ): Promise<void> {
    const stock = await this.stockModelRepository.findOne({
      where: { codeCVM: stockCode.toString() },
    });
    if (!stock)
      return this.logger.error(`Stock with codeCVM ${stockCode} not found`);

    const updatedStock = await this.updateStock(stock, stockDetail);
    if (stockDetail.otherCodes?.length)
      await this.updateOtherCodes(stockDetail.otherCodes, updatedStock.id);
  }

  private fetchStockDetails(stockCodes: number[]): Promise<Stock[]> {
    return this.b3Crawler.getStockDetails(stockCodes.map(String));
  }

  private async updateStock(
    stock: StockModelDB,
    stockDetail: Partial<Stock>,
  ): Promise<StockModelDB> {
    return this.stockModelRepository.save({
      ...stock,
      ...stockDetail,
      updatedAt: new Date(),
    });
  }

  private async updateOtherCodes(
    otherCodes: OtherCode[],
    stockId: number,
  ): Promise<void> {
    const otherCodesList = otherCodes.map((code) => ({
      ...code,
      stock: { id: stockId },
    }));
    await this.stockCodeModelRepository.upsert(otherCodesList, ["code"]);
  }
}
