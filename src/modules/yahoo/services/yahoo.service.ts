import { IsNull, LessThan, Not, Repository } from 'typeorm';

import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { StockCodeModelDB } from '@/modules/b3/models/StockCode.model';
import { YahooDividendHistoryModelDB } from '@/modules/yahoo/models/YahooDividendHistory.model';
import { YahooHistoryModelDB } from '@/modules/yahoo/models/YahooHistory.model';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

// *    *    *    *    *    *
// -    -    -    -    -    -
// |    |    |    |    |    |
// |    |    |    |    |    +----- day of the week (0 - 6) (Sunday = 0)
// |    |    |    |    +------- month (1 - 12)
// |    |    |    +--------- day of the month (1 - 31)
// |    |    +----------- hour (0 - 23)
// |    +------------- min (0 - 59)
// +--------------- second (0 - 59) (optional)

const CRON_TIME_EVERY_5_SECONDS = '*/5 * * * * *';
const CRON_TIME_EVERY_10_SECONDS = '*/10 * * * * *';

const CRON_TIME_EVERY_MINUTE = '*/1 * * * *';
const CRON_TIME_EVERY_2_MINUTES = '*/2 * * * *';
const CRON_TIME_EVERY_5_MINUTES = '*/5 * * * *';
const CRON_RUN_EVERY_10_MINUTES = '*/10 * * * *';
const CRON_TIME_EVERY_2_HOURS = '0 */2 * * *';
const CRON_TIME_EVERY_DAY_AT_8AM = '0 8 * * *';
const CRON_TIME_EVERY_HOUR = '0 * * * *';

const DATE_OPTIONS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  timeZone: 'America/Sao_Paulo',
};

@Injectable()
export class YahooService {
  private readonly logger = new Logger(YahooService.name);

  constructor(
    @InjectRepository(YahooHistoryModelDB)
    private yahooHistoryModelDB: Repository<YahooHistoryModelDB>,

    @InjectRepository(StockModelDB)
    private stockModelDB: Repository<StockModelDB>,

    @InjectRepository(StockCodeModelDB)
    private stockCodeModelDB: Repository<StockCodeModelDB>,

    @InjectRepository(YahooDividendHistoryModelDB)
    private yahooDividendHistoryModelDB: Repository<YahooDividendHistoryModelDB>,

    @Inject(YahooCrawlerProvider)
    private yahooCrawlerProvider: YahooCrawlerProvider,
  ) { }

  // @Cron(CRON_TIME_EVERY_10_SECONDS)
  @LogMethod(new Logger(YahooService.name))
  async updateStocksHistory() {
    // Rewrite the code above to make a left join with the stock table
    const stockCodes = await this.stockCodeModelDB
      .createQueryBuilder('stockCode')
      .leftJoinAndSelect('stockCode.stock', 'stock')
      .where('stockCode.updatedAt < :updatedAt', {
        updatedAt: new Date(
          new Date().getTime() - 24 * 60 * 60 * 1000 /* 24 hours */,
        ),
      })
      .orderBy('stockCode.updatedAt', 'ASC')
      .limit(100)
      .getMany();

    if (!stockCodes.length) {
      this.logger.verbose(
        `No stocks to update at ${new Intl.DateTimeFormat(
          'pt-BR',
          DATE_OPTIONS as any,
        ).format(new Date())} `,
      );
      return [];
    }

    const stocksHistory = await Promise.all(
      stockCodes.map(async ({ code, stock }) => {
        const stockDotSa = code + '.SA';

        const yahooStockHistory = await this.yahooCrawlerProvider
          .getStockTradeHistory(stockDotSa)
          .catch((error) => {
            // If the error is 404 it means that the stock code is not valid
            if (error.message.includes('404')) {
              this.logger.warn(
                `Stock code ${stockDotSa} is not valid. Removing from the database`,
              );
              this.stockCodeModelDB.delete({ code: stockDotSa });
            }
          });

        if (!yahooStockHistory) return [];

        const yahooStockHistorySaved = await this.yahooHistoryModelDB.upsert(
          yahooStockHistory.map((stockHistory) => ({
            ...stockHistory,
            stock,
          })),
          ['date', 'stock.id'],
        );

        return yahooStockHistorySaved;
      }),
    );

    // Log how many stocks were update
    this.logger.verbose(
      `Updated ${stockCodes.length} stocks at ${new Intl.DateTimeFormat(
        'pt-BR',
        DATE_OPTIONS as any,
      ).format(new Date())} `,
    );

    // Update the stock last update date
    await Promise.all(
      stockCodes.map(async (stock) => {
        await this.stockCodeModelDB.update(stock.id, {
          updatedAt: new Date(),
        });
      }),
    );

    return stocksHistory;
  }

  // @Cron(CRON_TIME_EVERY_10_SECONDS)
  @LogMethod(new Logger(YahooService.name))
  async updateStocksDividends() {
    const stockCodes = await this.stockCodeModelDB
      .createQueryBuilder('stockCode')
      .leftJoinAndSelect('stockCode.stock', 'stock')
      .where('stockCode.updatedAt < :updatedAt', {
        updatedAt: new Date(
          new Date().getTime() - 24 * 60 * 60 * 1000 /* 24 hours */,
        ),
      })
      .orderBy('stockCode.updatedAt', 'ASC')
      .limit(100)
      .getMany();

    if (!stockCodes.length) {
      this.logger.verbose(
        `No stocks to update at ${new Intl.DateTimeFormat(
          'pt-BR',
          DATE_OPTIONS as any,
        ).format(new Date())} `,
      );
      return [];
    }

    const stocksDividends = await Promise.all(
      stockCodes.map(async ({ code, stock }) => {
        const stockDotSa = code + '.SA';

        const yahooStockDividends = await this.yahooCrawlerProvider
          .getStockDividends(stockDotSa)
          .catch((error) => {
            // If the error is 404 it means that the stock code is not valid
            if (error.message.includes('404')) {
              this.logger.warn(
                `Stock code ${stockDotSa} is not valid. Removing from the database`,
              );
              this.stockCodeModelDB.delete({ code: stockDotSa });
            }
          });

        if (!yahooStockDividends) return [];

        const yahooStockDividendsSaved =
          await this.yahooDividendHistoryModelDB.upsert(
            yahooStockDividends.map((stockDividend) => ({
              ...stockDividend,
              stock,
            })),
            ['date', 'stock.id'],
          );

        return yahooStockDividendsSaved;
      }),
    );

    // Log how many stocks were update
    this.logger.verbose(
      `Updated ${stockCodes.length} stocks at ${new Intl.DateTimeFormat(
        'pt-BR',
        DATE_OPTIONS as any,
      ).format(new Date())} `,
    );

    // Update the stock last update date
    await Promise.all(
      stockCodes.map(async (stock) => {
        await this.stockCodeModelDB.update(stock.id, {
          updatedAt: new Date(),
        });
      }),
    );

    return stocksDividends;
  }
}

export function LogMethod(logger: Logger) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const logMessage = `Method ${propertyKey} called at ${new Intl.DateTimeFormat(
        'pt-BR',
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          timeZone: 'America/Sao_Paulo',
        },
      ).format(new Date())} `;
      logger.verbose(logMessage);
      const result = await originalMethod.apply(this, args);
      return result;
    };
    return descriptor;
  };
}
