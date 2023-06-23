// src/modules/yahoo/usecases/update-yahoo-stock-dividends/update-yahoo-stock-dividends.service.ts

import { In, Repository } from 'typeorm';

import { YahooDividendHistoryModelDB } from '@/modules/yahoo/models/YahooDividendHistory.model';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StockModelDB } from '@/modules/b3/models/Stock.model';

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

  async execute(
    stockCodeList?: number[],
  ): Promise<YahooDividendHistoryModelDB[]> {
    const stocks = await this.stockModelDB.find({
      where: { code: In(stockCodeList) },
    });

    if (!stocks.length) {
      this.logger.warn('No stock codes found');
      return [];
    }

    const stocksdividend = await Promise.all(
      stocks.map(async ({ code }) => {
        const stockDotSa = code + '.SA';

        const yahooStockdividend =
          await this.yahooCrawlerProvider.getStockdividend(stockDotSa);

        if (!yahooStockdividend) return [];

        const yahooStockdividendSaved =
          await this.yahooDividendHistoryModelDB.upsert(yahooStockdividend, [
            'stockId',
            'date',
          ]);

        return (await this.yahooDividendHistoryModelDB.save(
          yahooStockdividendSaved.generatedMaps,
        )) as YahooDividendHistoryModelDB[];
      }),
    );

    // Log how many stocks were update
    this.logger.verbose(
      `Updated ${stocksdividend.flat().length} stock dividend history`,
    );

    return stocksdividend.flat();
  }
}
