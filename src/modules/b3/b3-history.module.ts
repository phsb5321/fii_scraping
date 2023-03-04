import { B3HistoryModelDB } from '@/modules/b3/models/B3History.model';
import { ProvidersModule } from '@/modules/b3/providers/providers.module';
import { B3HistoryService } from '@/modules/b3/services/b3-history.service';
import { FiiModelDB } from '@/modules/fii-explorer/model/Fii.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([B3HistoryModelDB, FiiModelDB]),
    ProvidersModule,
  ],
  providers: [
    // B3History
    B3HistoryService,

    // ProvidersModule
    ProvidersModule,
  ],

  exports: [B3HistoryService],
})
export class B3HistoryModule { }
