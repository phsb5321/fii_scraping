import { B3HistoryModule } from '@/modules/b3-history/b3-history.module';
import { FiiExplorerModule } from '@/modules/fii-explorer/fii-explorer.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // Modules
    FiiExplorerModule,
    B3HistoryModule,
  ],
})
export class ModulesModule {}
