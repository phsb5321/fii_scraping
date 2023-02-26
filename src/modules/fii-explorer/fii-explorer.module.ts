import { FiiModelDB } from '@/modules/fii-explorer/model/Fii.entity';
import { FiiRankingModelDB } from '@/modules/fii-explorer/model/FiiRanking.entity';
import { FiiExplorer } from '@/modules/fii-explorer/model/scrapper';
import { FiiExplorerService } from '@/modules/fii-explorer/services/fii-explorer.service';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([FiiRankingModelDB, FiiModelDB]),
  ],
  providers: [
    // FiiExplorer,
    FiiExplorer,
    FiiExplorerService,
  ],
})
export class FiiExplorerModule { }

// q: where should I add the logger to the module?
// a: add it to the providers array
