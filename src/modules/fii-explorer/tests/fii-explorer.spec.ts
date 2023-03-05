import { FiiExplorer } from '@/modules/fii-explorer/model/scrapper';
describe('FiiExplorer', () => {
  let fiiExplorer: FiiExplorer;

  beforeEach(() => {
    fiiExplorer = new FiiExplorer();
  });

  it('should be defined', () => {
    expect(fiiExplorer).toBeDefined();
  });
});
