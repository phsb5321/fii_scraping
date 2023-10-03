import { EventConfigs } from '@/app/utils/EventConfigs';
import { ScrapeAllStocksService } from '@/modules/b3/usecases/scrape-all-stocks/scrape-all-stocks.service';
import { UpdateAllStockService } from '@/modules/b3/usecases/update-all-stock/update-all-stock.service';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Stock } from '@prisma/client';

@Injectable()
export class B3Service {
  private logger = new Logger(B3Service.name);

  constructor(
    private scrapeAllStocksService: ScrapeAllStocksService,
    private updateAllStockService: UpdateAllStockService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent(EventConfigs.SCRAPE_ALL_STOCKS)
  async handleScrapeAllStocks(): Promise<void> {
    try {
      const result = await this.scrapeAllStocks();
      this.logger.verbose(`Handled ${EventConfigs.SCRAPE_ALL_STOCKS} event`);
      this.eventEmitter.emit(EventConfigs.SCRAPE_ALL_STOCKS_RESPONSE, result);
    } catch (error) {
      this.logger.error(`Error in ${EventConfigs.SCRAPE_ALL_STOCKS} event`, error.stack);
      throw error;
    }
  }

  @OnEvent(EventConfigs.SCRAPE_ALL_STOCKS_DETAILS)
  async handleScrapeAllStocksDetails(): Promise<void> {
    try {
      const result = await this.scrapeAllStocksDetails();
      this.logger.verbose(`Handled ${EventConfigs.SCRAPE_ALL_STOCKS_DETAILS} event`);
      this.eventEmitter.emit(EventConfigs.SCRAPE_ALL_STOCKS_DETAILS_RESPONSE, result);
    } catch (error) {
      this.logger.error(`Error in ${EventConfigs.SCRAPE_ALL_STOCKS_DETAILS} event`, error.stack);
      throw error;
    }
  }

  async scrapeAllStocks(): Promise<string> {
    this.logger.verbose(`Executing ${EventConfigs.SCRAPE_ALL_STOCKS}`);
    const scrapedStocks = await this.scrapeAllStocksService.execute();
    return scrapedStocks;
  }

  async scrapeAllStocksDetails(): Promise<Stock[]> {
    try {
      this.logger.verbose(`Executing ${EventConfigs.SCRAPE_ALL_STOCKS_DETAILS}`);
      const scrapedStocksDetails = await this.updateAllStockService.execute();
      this.logger.verbose(`Updated details for ${scrapedStocksDetails.length} stocks`);
      return scrapedStocksDetails;
    } catch (error) {
      this.logger.error(`Error in ${EventConfigs.SCRAPE_ALL_STOCKS_DETAILS}`, error.stack);
      throw error;
    }
  }
}
