import { StockModelDB } from '@/app/models/Stock.model';
import { EventConfigs } from '@/app/utils/EventConfigs';
import { B3Service } from '@/modules/b3/services/b3.service';
import { Controller, Get, Logger, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('B3')
@Controller('b3')
export class B3Controller {
  private logger = new Logger(B3Controller.name);

  constructor(
    private b3Service: B3Service,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post('scrape-all-stocks')
  @ApiOperation({ summary: 'Trigger event to scrape all stocks' })
  @ApiResponse({ status: 200, description: 'The event has been triggered' })
  async scrapeAllStocks(): Promise<string> {
    this.logger.verbose(`Triggering ${EventConfigs.SCRAPE_ALL_STOCKS} event`);
    return new Promise(resolve => {
      this.eventEmitter.once(EventConfigs.SCRAPE_ALL_STOCKS_RESPONSE, data => {
        resolve(`Scrape all stocks event has been triggered! ${data}`);
      });
      this.eventEmitter.emit(EventConfigs.SCRAPE_ALL_STOCKS);
    });
  }

  @Post('scrape-all-stocks-details')
  @ApiOperation({ summary: 'Trigger event to scrape all stock details' })
  @ApiResponse({ status: 200, description: 'The event has been triggered' })
  async scrapeAllStocksDetails(): Promise<string> {
    this.logger.verbose(`Triggering ${EventConfigs.SCRAPE_ALL_STOCKS_DETAILS} event`);
    return new Promise(resolve => {
      this.eventEmitter.once(EventConfigs.SCRAPE_ALL_STOCKS_DETAILS_RESPONSE, data => {
        resolve(`Scrape all stock details event has been triggered! ${data}`);
      });
      this.eventEmitter.emit(EventConfigs.SCRAPE_ALL_STOCKS_DETAILS);
    });
  }

  @Get('list-all-stocks')
  @ApiOperation({ summary: 'List all stocks' })
  @ApiResponse({ status: 200, description: 'The list of all stocks' })
  async listAllStocks(): Promise<StockModelDB[]> {
    return this.b3Service.listAllStocks();
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async scheduledScrapeAllStocks(): Promise<void> {
    this.eventEmitter.emit(EventConfigs.SCRAPE_ALL_STOCKS);
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async scheduledScrapeAllStocksDetails(): Promise<void> {
    this.eventEmitter.emit(EventConfigs.SCRAPE_ALL_STOCKS_DETAILS);
  }
}
