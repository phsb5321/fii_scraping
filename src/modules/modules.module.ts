import { B3HistoryModule } from '@/modules/b3/b3.module';
import { FiiExplorerModule } from '@/modules/fii-explorer/fii-explorer.module';
import { Module } from '@nestjs/common';
import { YahooModule } from './yahoo/yahoo.module';

@Module({
  imports: [
    // Modules
    FiiExplorerModule,
    B3HistoryModule,
    YahooModule,
  ],
})
export class ModulesModule {}
