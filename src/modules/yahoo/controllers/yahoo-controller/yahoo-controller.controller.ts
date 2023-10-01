import { EventConfigs } from '@/app/utils/EventConfigs';
import { Controller, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Yahoo')
@Controller('yahoo')
export class YahooController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post('update-yahoo-stock')
  @ApiOperation({ summary: 'Trigger event to update Yahoo Stock' })
  @ApiResponse({ status: 200, description: 'Event triggered successfully.' })
  async updateYahooStock(): Promise<string> {
    return new Promise(resolve => {
      this.eventEmitter.once('update.yahooStock.response', data => {
        resolve(`Update Yahoo stock event has been triggered! ${data}`);
      });
      this.eventEmitter.emit(EventConfigs.UPDATE_YAHOO_STOCK);
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_5AM)
  async scheduledUpdateYahooStock(): Promise<void> {
    this.eventEmitter.emit(EventConfigs.UPDATE_YAHOO_STOCK);
  }
}
