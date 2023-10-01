import { B3Controller } from '@/modules/b3/controllers/b3-controller/b3-controller.controller';
import { B3Service } from '@/modules/b3/services/b3.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

describe('B3Controller', () => {
  let controller: B3Controller;
  let b3Service: B3Service;
  let eventEmitter: EventEmitter2;

  beforeEach(async () => {
    const mockB3Service = {
      listAllStocks: jest.fn(),
    };

    const mockEventEmitter = {
      emit: jest.fn(),
      once: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [B3Controller],
      providers: [
        { provide: B3Service, useValue: mockB3Service },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    controller = module.get<B3Controller>(B3Controller);
    b3Service = module.get<B3Service>(B3Service);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('scrapeAllStocks', () => {
    it('should trigger event to scrape all stocks', async () => {
      eventEmitter.once.mockImplementation((event, callback) => callback('SomeData'));

      const result = await controller.scrapeAllStocks();

      expect(eventEmitter.emit).toHaveBeenCalledWith('SCRAPE_ALL_STOCKS');
      expect(result).toBe('Scrape all stocks event has been triggered! SomeData');
    });
  });

  describe('scrapeAllStocksDetails', () => {
    it('should trigger event to scrape all stock details', async () => {
      eventEmitter.once.mockImplementation((event, callback) => callback('SomeData'));

      const result = await controller.scrapeAllStocksDetails();

      expect(eventEmitter.emit).toHaveBeenCalledWith('SCRAPE_ALL_STOCKS_DETAILS');
      expect(result).toBe('Scrape all stock details event has been triggered! SomeData');
    });
  });

  describe('listAllStocks', () => {
    it('should list all stocks', async () => {
      const mockStocks = [{}, {}, {}];
      b3Service.listAllStocks.mockResolvedValue(mockStocks);

      const result = await controller.listAllStocks();

      expect(result).toBe(mockStocks);
    });
  });

  describe('scheduledScrapeAllStocks', () => {
    it('should emit scrape all stocks event', async () => {
      await controller.scheduledScrapeAllStocks();

      expect(eventEmitter.emit).toHaveBeenCalledWith('SCRAPE_ALL_STOCKS');
    });
  });

  describe('scheduledScrapeAllStocksDetails', () => {
    it('should emit scrape all stock details event', async () => {
      await controller.scheduledScrapeAllStocksDetails();

      expect(eventEmitter.emit).toHaveBeenCalledWith('SCRAPE_ALL_STOCKS_DETAILS');
    });
  });
});
