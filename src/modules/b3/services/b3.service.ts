import { StockModelDB } from '@/app/models/Stock.model';
import { EventConfigs } from '@/app/utils/EventConfigs';
import { ListAllStocksService } from '@/modules/b3/usecases/list-all-stocks/list-all-stocks.service';
import { ScrapeAllStocksService } from '@/modules/b3/usecases/scrape-all-stocks/scrape-all-stocks.service';
import { UpdateAllStockService } from '@/modules/b3/usecases/update-all-stock/update-all-stock.service';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class B3Service {
  private logger = new Logger(B3Service.name);

  constructor(
    private scrapeAllStocksService: ScrapeAllStocksService,
    private updateAllStockService: UpdateAllStockService,
    private listAllStocksService: ListAllStocksService,
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

  async scrapeAllStocks(): Promise<StockModelDB[]> {
    this.logger.verbose(`Executing ${EventConfigs.SCRAPE_ALL_STOCKS}`);
    const scrapedStocks = await this.scrapeAllStocksService.execute();
    return scrapedStocks;
  }

  async scrapeAllStocksDetails(): Promise<StockModelDB[]> {
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

  async listAllStocks(): Promise<StockModelDB[]> {
    this.logger.verbose(`Listing all stocks`);
    const stocks = await this.listAllStocksService.execute();
    return stocks;
  }
}
