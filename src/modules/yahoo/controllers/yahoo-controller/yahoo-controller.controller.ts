import { ExtractStockHistoryService } from '@/modules/yahoo/usecases/extract-stock-history/extract-stock-history.service';
import { Controller, Post } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Yahoo')
@Controller('yahoo')
export class YahooController {
  constructor(private readonly extractStockHistoryService: ExtractStockHistoryService) {}

  /**
   * Update Yahoo Stock.
   *
   * @returns {Promise<string>} Update status message
   */
  @Post('update-yahoo-stock')
  @ApiOperation({ summary: 'Update Yahoo Stock' })
  @ApiResponse({ status: 200, description: 'Stocks updated successfully.' })
  async updateYahooStock(): Promise<string> {
    return this.extractStockHistoryService.execute();
  }

  /**
   * Scheduled job to update Yahoo Stock at 5AM every day.
   */
  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async scheduledUpdateYahooStock(): Promise<void> {
    await this.updateYahooStock();
  }
}
