import { Repository } from 'typeorm';

import { B3HistoryModelDB } from '@/modules/b3/models/B3History.model';
import { B3ScrapperProvider } from '@/modules/b3/providers/b3_scrapper.provider/b3_scrapper.provider';
import { FiiModelDB } from '@/modules/fii-explorer/model/Fii.entity';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ScrapeB3HistoryService {
  private readonly logger = new Logger(ScrapeB3HistoryService.name);

  constructor(
    // Repositories
    @InjectRepository(B3HistoryModelDB)
    private fiiB3HistoryModelDB: Repository<B3HistoryModelDB>,

    @InjectRepository(FiiModelDB)
    private fiiModelRepository: Repository<FiiModelDB>,

    // Providers
    @Inject(B3ScrapperProvider)
    private b3Scrapper: B3ScrapperProvider,
  ) { }

  async execute() {
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
        const { data } = await this.b3Scrapper.getFiiHistory(
          fii.codigo_do_fundo,
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
