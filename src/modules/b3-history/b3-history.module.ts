import { B3History } from '@/modules/b3-history/model/scrapper';
import { B3HistoryService } from '@/modules/b3-history/services/b3-history.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiiModelDB } from '../fii-explorer/model/Fii.entity';
import { B3HistoryModelDB } from '@/modules/b3-history/model/B3History.entity';

@Module({
  imports: [TypeOrmModule.forFeature([B3HistoryModelDB, FiiModelDB])],
  providers: [
    // B3History
    B3History,
    B3HistoryService,
  ],
})
export class B3HistoryModule {}
