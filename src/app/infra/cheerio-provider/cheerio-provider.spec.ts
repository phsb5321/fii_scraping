import { Test, TestingModule } from '@nestjs/testing';
import { CheerioProvider } from './cheerio-provider';

describe('CheerioProvider', () => {
  let provider: CheerioProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheerioProvider],
    }).compile();

    provider = module.get<CheerioProvider>(CheerioProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
