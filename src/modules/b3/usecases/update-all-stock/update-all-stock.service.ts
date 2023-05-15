// src/modules/b3/usecases/update-all-stock/update-all-stock.service.ts

import { In, Repository } from 'typeorm';

import { StockI } from '@/app/entities/Stock/Stock.entity';
import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { StockCodeModelDB } from '@/modules/b3/models/StockCode.model';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

const asyncGenerator = async function* <T>(
  promises: Promise<T>[],
): AsyncGenerator<[T, number]> {
  const remainingPromises = promises.map((promise, index) => ({
    promise,
    index,
  }));

  while (remainingPromises.length > 0) {
    const indexToResolve = await Promise.race(
      remainingPromises.map(({ promise }, index) => promise.then(() => index)),
    );

    const { promise, index } = remainingPromises[indexToResolve];
    remainingPromises.splice(indexToResolve, 1);

    yield [await promise, index];
  }
};
@Injectable()
export class UpdateAllStockService {
  private readonly logger = new Logger(UpdateAllStockService.name);

  constructor(
    @InjectRepository(StockModelDB)
    private stockModelRepository: Repository<StockModelDB>,

    @InjectRepository(StockCodeModelDB)
    private stockCodeModelRepository: Repository<StockCodeModelDB>,

    @Inject(B3CrawlerProvider)
    private b3Crawler: B3CrawlerProvider,
  ) { }

  async execute(): Promise<StockModelDB[]> {
    const stocks = await this.stockModelRepository.find();

    if (!stocks || stocks.length === 0) {
      this.logger.verbose('No stocks found');
      return [];
    }

    this.logger.verbose(`About to update ${stocks.length} stocks`);

    const stockDetailsPromises = (
      await this.b3Crawler.getStockDetails(stocks.map((stock) => stock.codeCVM))
    ).map((stockDetail) => Promise.resolve(stockDetail));

    const updatedStocks: StockModelDB[] = [];

    for await (const [stockDetail, index] of asyncGenerator(
      stockDetailsPromises,
    )) {
      const response = await this.updateStock(stocks[index], stockDetail);
      const { otherCodes } = stockDetail;

      if (otherCodes && otherCodes.length > 0) {
        await this.updateOtherCodes(otherCodes, response.id);
      }

      updatedStocks.push(response);
    }

    this.logger.log(
      `Updated ${updatedStocks.length} stock(s) in the database.`,
    );

    return updatedStocks;
  }

  private async updateStock(
    stock: StockModelDB,
    stockDetail: any,
  ): Promise<StockModelDB> {
    return await this.stockModelRepository.save({
      ...stock,
      ...stockDetail,
      updatedAt: new Date(),
    });
  }

  private async updateOtherCodes(
    otherCodes: any[],
    stockId: number,
  ): Promise<void> {
    const otherCodesList = otherCodes.map((code) => ({
      ...code,
      stock: { id: stockId },
    }));

    await this.stockCodeModelRepository
      .upsert(otherCodesList, ['code'])
      .then((result) => result.generatedMaps);
  }
}
