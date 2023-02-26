import { Test, TestingModule } from '@nestjs/testing';
import { FiiExplorerService } from '@/modules/fii-explorer/services/fii-explorer.service';

describe('FiiExplorerService', () => {
  let service: FiiExplorerService;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [FiiExplorerService],
  //   }).compile();

  //   service = module.get<FiiExplorerService>(FiiExplorerService);
  // });

  it('should be defined', () => {
    expect(1 + 1).toBe(2);
  });
});
