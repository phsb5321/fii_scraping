// src/b3/usecases/scrape-b3-history/scrape-b3-history.service.spec.ts
import { B3HistoryModelDB } from '@/modules/b3/models/B3History.model';
import { B3ScrapperProvider } from '@/modules/b3/providers/b3_scrapper.provider/b3_scrapper.provider';
import { FiiModelDB } from '@/modules/fii-explorer/model/Fii.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ScrapeB3HistoryService } from './scrape-b3-history.service';

describe('ScrapeB3HistoryService', () => {
  let service: ScrapeB3HistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScrapeB3HistoryService,
        // mock the repositories
        {
          provide: getRepositoryToken(B3HistoryModelDB),
          useValue: {},
        },
        {
          provide: getRepositoryToken(FiiModelDB),
          useValue: {},
        },
        // mock the provider
        {
          provide: B3ScrapperProvider,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ScrapeB3HistoryService>(ScrapeB3HistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
