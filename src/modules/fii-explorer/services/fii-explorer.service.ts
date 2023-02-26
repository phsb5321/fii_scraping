import { Like, Repository } from 'typeorm';

import { FiiModelDB } from '@/modules/fii-explorer/model/Fii.entity';
import { FiiRankingModelDB } from '@/modules/fii-explorer/model/FiiRanking.entity';
import { FiiExplorer } from '@/modules/fii-explorer/model/scrapper';
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';

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
export class FiiExplorerService {
  private readonly logger = new Logger(FiiExplorerService.name);

  constructor(
    private readonly fiiExplorer: FiiExplorer,
    @InjectRepository(FiiRankingModelDB)
    private fiiRankingRepository: Repository<FiiRankingModelDB>,
    @InjectRepository(FiiModelDB)
    private fiiModelRepository: Repository<FiiModelDB>,
  ) { }

  @Cron(CRON_TIME_EVERY_DAY_AT_8AM)
  async scrape_fii_ranking() {
    const funds = await this.fiiExplorer.scrapeFiiList();

    // Log the number of funds found
    this.logger.verbose(`Found ${funds.length} funds`);

    let newFunds = 0;

    await Promise.all(
      funds.map(async (fii) => {
        // Check if the FII already exists in the database
        const hasFii = await this.fiiModelRepository.findOne({
          where: { codigo_do_fundo: fii.codigo_do_fundo },
        });

        // If it does not exist, create it
        if (!hasFii) {
          // Create the FII and FiiRanking
          const newFii = await this.fiiModelRepository.save(fii);
          await this.fiiRankingRepository.save({
            fii: newFii,
            ...fii,
          });

          newFunds++;
        }

        // If it exists, update it
        else {
          // If the is no FiiRanking with createdAt === today, create it
          const hasFiiRanking = await this.fiiRankingRepository.findOne({
            where: {
              fii: hasFii,
            },
          });
        }
      }),
    );

    // Log the number of new and updated funds
    this.logger.verbose(
      `Found ${newFunds} new funds && updated ${funds.length - newFunds} funds`,
    );
  }
}
