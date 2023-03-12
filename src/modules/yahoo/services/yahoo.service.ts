import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { YahooHistoryModelDB } from './../models/YahooHistory.model';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, LessThan, Not, Repository } from 'typeorm';
import { YahooStockHIstoryI } from '@/app/entities/YahooHistory/YahooHistory.entity';

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

    @Inject(YahooCrawlerProvider)
    private yahooCrawlerProvider: YahooCrawlerProvider,
  ) { }

  @Cron(CRON_TIME_EVERY_10_SECONDS)
  @LogMethod(new Logger(YahooService.name))
  async updateStocksHistory() {
    const stocks = await this.stockModelDB.find({
      // Where otherCodes IS NOT NULL and it has been updated more than 24 hours ago
      where: {
        otherCodes: Not(IsNull()),
        updatedAt: LessThan(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000 /* 24 hours */),
        ),
      },
      // Order BY UpdatedAt DESC
      order: { updatedAt: 'ASC' },
      // Limit 10
      take: 10,
    });

    if (!stocks.length) {
      this.logger.verbose(
        `No stocks to update at ${new Intl.DateTimeFormat(
          'pt-BR',
          DATE_OPTIONS as any,
        ).format(new Date())} `,
      );
      return [];
    }

    const stocksHistory = await Promise.all(
      stocks.map(async (stock) => {
        const stockCodes = [
          stock.code,
          ...(stock.otherCodes || []).flatMap((code) => code?.code || []),
        ];

        const stockHistories = await Promise.all(
          stockCodes.map(async (code) => {
            let stockHistory: YahooStockHIstoryI[];
            try {
              stockHistory = await this.yahooCrawlerProvider.getStock(
                `${code}.SA`,
              );
              this.logger.verbose(
                `Updated stock ${code} at ${new Intl.DateTimeFormat(
                  'pt-BR',
                  DATE_OPTIONS as any,
                ).format(new Date())} `,
              );
            } catch ({ message }) {
              // Log that the stock history could not be updated
              this.logger.error(message);
              return [];
            }
            // For each stock history, If there is no stock history in the database with the same date, save it
            await Promise.all(
              stockHistory.map(async (history) => {
                // Check if there is a stock history with the same date
                const stockHistoryInDB = await this.yahooHistoryModelDB.findOne(
                  {
                    where: { date: history.date, stockCode: code },
                  },
                );

                // If there is no stock history in the database with the same date, save it
                if (!stockHistoryInDB) {
                  await this.yahooHistoryModelDB.save(
                    this.yahooHistoryModelDB.create({
                      ...history,
                      stockCode: code,
                      stock,
                    }),
                  );
                }
              }),
            );
            return stockHistory;
          }),
        );

        return stockHistories;
      }),
    );

    // Log how many stocks were updated
    this.logger.verbose(
      `Updated ${stocks.length} stocks at ${new Intl.DateTimeFormat(
        'pt-BR',
        DATE_OPTIONS as any,
      ).format(new Date())} `,
    );

    // Update the stock last update date
    await Promise.all(
      stocks.map(async (stock) => {
        await this.stockModelDB.update(stock.id, {
          updatedAt: new Date(),
        });
      }),
    );

    return stocksHistory;
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
