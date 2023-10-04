import { ScrapeAllStocksService } from '@/modules/b3/usecases/scrape-all-stocks/scrape-all-stocks.service';
import { UpdateAllStockService } from '@/modules/b3/usecases/update-all-stock/update-all-stock.service';
import { Controller, Post } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('B3')
@Controller('b3')
export class B3Controller {
  constructor(
    private readonly scrapeAllStocksService: ScrapeAllStocksService,
    private readonly updateAllStockService: UpdateAllStockService,
  ) {}

  @Post('scrape-all-stocks')
  @ApiOperation({ summary: 'Scrape all stocks' })
  @ApiResponse({ status: 200, description: 'The scraping has been triggered' })
  async scrapeAllStocks(): Promise<string> {
    return this.scrapeAllStocksService.execute();
  }

  @Post('scrape-all-stocks-details')
  @ApiOperation({ summary: 'Scrape all stock details' })
  @ApiResponse({ status: 200, description: 'The scraping has been triggered' })
  async scrapeAllStocksDetails(): Promise<string> {
    return this.updateAllStockService.execute();
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async scheduledScrapeAllStocks(): Promise<void> {
    await this.scrapeAllStocks();
  }

  @Cron(CronExpression.EVERY_DAY_AT_4AM)
  async scheduledScrapeAllStocksDetails(): Promise<void> {
    await this.scrapeAllStocksDetails();
  }
}
