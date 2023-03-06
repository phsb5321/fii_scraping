import { LessThan, Repository } from 'typeorm';

import { StockI } from '@/app/entities/Stock/Stock.entity';
import { B3HistoryModelDB } from '@/modules/b3/models/B3History.model';
import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { B3ScrapperProvider } from '@/modules/b3/providers/b3_scrapper.provider/b3_scrapper.provider';
import { FiiModelDB } from '@/modules/fii-explorer/model/Fii.entity';
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

@Injectable()
export class B3Service {
  private readonly logger = new Logger(B3Service.name);

  constructor(
    @InjectRepository(B3HistoryModelDB)
    private fiiB3HistoryModelDB: Repository<B3HistoryModelDB>,

    @InjectRepository(FiiModelDB)
    private fiiModelRepository: Repository<FiiModelDB>,

    @InjectRepository(StockModelDB)
    private stockModelRepository: Repository<StockModelDB>,

    @Inject(B3ScrapperProvider)
    private b3Scrapper: B3ScrapperProvider,

    @Inject(B3CrawlerProvider)
    private b3Crawler: B3CrawlerProvider,
  ) { }

  // @Cron(CRON_RUN_EVERY_10_MINUTES)
  @LogMethod(new Logger(B3Service.name))
  async scrape_all_stocks() {
    const stocks: StockI[] = await this.b3Crawler.getStocks();

    let newStocksCount = 0;

    const newStocks = await Promise.all(
      stocks.map(async (stock) => {
        // Search for an existing stock
        const existingStock = await this.stockModelRepository.findOne({
          where: { issuingCompany: stock.issuingCompany },
        });

        // If the stock already exists, skip it
        if (existingStock) return;

        // Create a new stock
        const newStock = await this.stockModelRepository.create(stock);
        newStocksCount++;

        // Save the new stock
        return await this.stockModelRepository.save(newStock);
      }),
    );

    // Log the number of new stocks found
    this.logger.verbose(`Found ${newStocksCount} new stocks`);

    return newStocks;
  }

  // @Cron(CRON_TIME_EVERY_MINUTE)
  @LogMethod(new Logger(B3Service.name))
  async update_all_stocks() {
    const stocks: StockI[] = await this.stockModelRepository.find({
      order: { updatedAt: 'DESC' },
      take: 1000,
    });

    let updatedStocksCount = 0;

    while (stocks.length > 0) {
      const stockDetailsPromises = stocks.map((stock) =>
        this.b3Crawler.getStockDetails(stock.codeCVM.toString()),
      );

      const stockDetails = await Promise.all(stockDetailsPromises);

      const updatedStockPromises = stockDetails.map((stockDetail, index) =>
        this.stockModelRepository.save({
          ...stocks[index],
          ...stockDetail[0],
          updatedAt: new Date(),
        }),
      );

      const updatedStocks = await Promise.all(updatedStockPromises);
      updatedStocksCount += updatedStocks.length;

      stocks.splice(0, 1000);
    }

    // Log the number of stocks updated
    this.logger.verbose(`Updated ${updatedStocksCount} stocks`);
  }

  // @Cron(CRON_TIME_EVERY_MINUTE)
  async scrape_b3_history() {
    const dictionary = {
      especif: 'especificacao_papel',
      n_negocios: 'numero_negocios',
      part: 'participacao_papel',
      quantidade: 'quantidade_total_titulos',
      volume: 'volume_total_titulos',
      aber: 'preco_abertura',
      min: 'preco_minimo',
      max: 'preco_maximo',
      med: 'preco_medio',
      fech: 'preco_fechamento',
    };

    const funds = await this.fiiModelRepository.find();

    // Log the number of funds found
    this.logger.verbose(`Found ${funds.length} funds`);

    await Promise.all(
      funds.map(async (fii) => {
        const { data, errors } = await this.b3Scrapper.getFiiHistory(
          fii.codigo_do_fundo,
        );

        // Log the number of errors found
        this.logger.verbose(
          `Found ${errors.length} errors in ${fii.codigo_do_fundo}`,
        );

        // For each data entry, create a new B3HistoryModelDB
        await Promise.all(
          data.map(async (entry) => {
            // Search for an existing entry
            const existingEntry = await this.fiiB3HistoryModelDB.findOne({
              where: {
                fii: { codigo_do_fundo: fii.codigo_do_fundo },
                pregao_date: entry[dictionary['pregao_date']] as Date,
              },
            });

            // If the entry already exists, skip it
            if (existingEntry) return;

            // Create a new entry
            const newEntry = new B3HistoryModelDB();

            //   Use the dictionary to map the data to the B3HistoryModelDB
            Object.keys(dictionary).forEach((key) => {
              newEntry[dictionary[key]] = entry[key];
            });

            // Set the fii and save the entry
            newEntry.fii = fii;

            await this.fiiB3HistoryModelDB.save({
              ...newEntry,
              fii: { codigo_do_fundo: fii.codigo_do_fundo },
              pregao_date: entry[dictionary['pregao_date']] as Date,
            });
          }),
        );
      }),
    );
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
