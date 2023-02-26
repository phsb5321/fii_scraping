import { Injectable, Logger } from '@nestjs/common';
import { B3History } from '@/modules/b3-history/model/scrapper';

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
  ) { }
}
