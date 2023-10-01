import { B3HistoryModule } from '@/modules/b3/b3.module';
import { YahooModule } from '@/modules/yahoo/yahoo.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    // Modules
    B3HistoryModule,
    YahooModule,
  ],
  controllers: [],
})
export class ModulesModule {}
