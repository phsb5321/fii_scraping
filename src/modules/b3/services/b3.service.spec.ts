import { B3CrawlerProvider } from '@/modules/b3/providers/b3_crawler.provider/b3_crawler.provider';
import { B3ScrapperProvider } from '@/modules/b3/providers/b3_scrapper.provider/b3_scrapper.provider';
import { B3Service } from '@/modules/b3/services/b3.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('B3Service', () => {
  let service: B3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [B3Service, B3ScrapperProvider, B3CrawlerProvider],
    }).compile();

    service = module.get<B3Service>(B3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a list of stocks', async () => {
    const stocks = await service.update_all_stocks();
    expect(stocks).toBeDefined();
  });

});
