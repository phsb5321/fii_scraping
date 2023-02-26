import { FiiExplorer } from '@/modules/fii-explorer/model/scrapper';
import { FiiRankingModelDB } from '@/modules/fii-explorer/model/FiiRanking.entity';
describe('FiiExplorer', () => {
  let fiiExplorer: FiiExplorer;

  beforeEach(() => {
    fiiExplorer = new FiiExplorer();
  });

  it('should be defined', () => {
    expect(fiiExplorer).toBeDefined();
  });
});
