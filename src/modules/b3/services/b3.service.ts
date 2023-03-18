import { Queue } from 'bull';

import LogMethod from '@/app/utils/LogMethod';
import { StockModelDB } from '@/modules/b3/models/Stock.model';
import { ScrapeAllStocksService } from '@/modules/b3/usecases/scrape-all-stocks/scrape-all-stocks.service';
import { ScrapeB3HistoryService } from '@/modules/b3/usecases/scrape-b3-history/scrape-b3-history.service';
import { UpdateAllStockService } from '@/modules/b3/usecases/update-all-stock/update-all-stock.service';
import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class B3Service {
  constructor(
    // Usecases
    @Inject(ScrapeAllStocksService)
    private scrapeAllStocksService: ScrapeAllStocksService,

    @Inject(UpdateAllStockService)
    private updateAllStockService: UpdateAllStockService,

    @Inject(ScrapeB3HistoryService)
    private scrapeB3HistoryService: ScrapeB3HistoryService,

    // Queues
    @InjectQueue('stocks-queue')
    private stocksQueue: Queue,
  ) { }

  /**
   * Scrape all stocks and add them to the stocks queue for further processing.
   * @returns {Promise<StockModelDB[]>} The list of newly scraped stocks.
   */
  @LogMethod(new Logger(B3Service.name))
  async scrape_all_stocks(): Promise<StockModelDB[]> {
    // Execute the ScrapeAllStocksService to get the list of scraped stocks
    const scrapedStocks = await this.scrapeAllStocksService.execute();

    // For each scraped stock, add a job to the stocks queue for processing
    scrapedStocks.forEach((stock) => {
      // Add a job with the name 'job: scrape details' and the stock as data
      this.stocksQueue.add('job: scrape details', stock);
    });

    // Return the list of scraped stocks
    return scrapedStocks;
  }

  // @Cron(CRON_TIME_EVERY_5_MINUTES)
  @LogMethod(new Logger(B3Service.name))
  async update_all_stocks() {
    return this.updateAllStockService.execute();
  }

  // @Cron(CRON_TIME_EVERY_MINUTE)
  async scrape_b3_history() {
    return this.scrapeB3HistoryService.execute();
  }
}
