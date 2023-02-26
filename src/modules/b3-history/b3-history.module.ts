import { B3History } from '@/modules/b3-history/model/scrapper';
import { B3HistoryService } from '@/modules/b3-history/services/b3-history.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [
    // B3History
    B3History,
    B3HistoryService],
})
export class B3HistoryModule { }
