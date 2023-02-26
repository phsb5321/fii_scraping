import { Injectable, Logger } from '@nestjs/common';
import { B3History } from '@/modules/b3-history/model/scrapper';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { FiiRankingModelDB } from '@/modules/fii-explorer/model/FiiRanking.entity';
import { Repository } from 'typeorm';
import { FiiModelDB } from '@/modules/fii-explorer/model/Fii.entity';
import { B3HistoryModelDB } from '@/modules/b3-history/model/B3History.entity';

// Cron Explanation
// ┌───────────── second (optional)
// │ ┌───────────── minute
// │ │ ┌───────────── hour
// │ │ │ ┌───────────── day of month
// │ │ │ │ ┌───────────── month
// │ │ │ │ │ ┌───────────── day of week
// │ │ │ │ │ │
// │ │ │ │ │ │
// * * * * * *

const CRON_TIME_EVERY_MINUTE = '* * * * * *';
const CRON_TIME_EVERY_5_MINUTES = '*/5 * * * * *';
const CRON_TIME_EVERY_2_HOURS = '0 */2 * * * *';
const CRON_TIME_EVERY_DAY_AT_8AM = '0 0 8 * * *';

@Injectable()
export class B3HistoryService {
  private readonly logger = new Logger(B3HistoryService.name);

  constructor(
    private readonly fiiExplorer: B3History,
    @InjectRepository(B3HistoryModelDB)
    private fiiB3HistoryModelDB: Repository<B3HistoryModelDB>,
    @InjectRepository(FiiModelDB)
    private fiiModelRepository: Repository<FiiModelDB>,
  ) { }

  @Cron(CRON_TIME_EVERY_MINUTE)
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
        const { data, errors } = await this.fiiExplorer.getFiiHistory(
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
