import { B3HistoryModule } from '@/modules/b3/b3-history.module';
import { FiiExplorerModule } from '@/modules/fii-explorer/fii-explorer.module';
import { YahooModule } from '@/modules/yahoo/yahoo.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // Modules
    FiiExplorerModule,
    B3HistoryModule,
    YahooModule,
  ],
})
export class ModulesModule { }
