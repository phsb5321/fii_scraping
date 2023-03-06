import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { YahooCrawlerProvider } from '@/modules/yahoo/providers/yahoo_crawler.provider/yahoo_crawler.provider';
import { YahooHistoryModelDB } from './../models/YahooHistory.model';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  // @Cron(CRON_TIME_EVERY_10_SECONDS)
  @LogMethod(new Logger(YahooService.name))
  async updateStocksHistory() {
    const stocks = await this.stockModelDB.find();

    const stocksHistory = await Promise.all(
      stocks.map(async (stock) => {
        const stockCodes = [
          stock.code,
          ...(stock.otherCodes || []).flatMap((code) => code?.code || []),
        ];

        const stockHistories = await Promise.all(
          stockCodes.map(async (code) => {
            const stockHistory = await this.yahooCrawlerProvider.getStock(code);

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
      ).format(new Date())}`;
      logger.verbose(logMessage);
      const result = await originalMethod.apply(this, args);
      return result;
    };
    return descriptor;
  };
}
