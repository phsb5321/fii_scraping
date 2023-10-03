import { Test, TestingModule } from '@nestjs/testing';
import { BatchProcessorService } from './batch-processor.service';

describe('BatchProcessorService', () => {
  let service: BatchProcessorService;
  let processBatch: jest.Mock;
  let items: number[];

  beforeEach(async () => {
    jest.useFakeTimers(); // We will use fake timers to control time based functionality

    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchProcessorService],
    }).compile();

    service = module.get<BatchProcessorService>(BatchProcessorService);

    // Proxyquire is a great tool for dependency injection
    processBatch = jest.fn().mockResolvedValue(null);

    // Setup items
    items = Array.from({ length: 300 }, (_, index) => index);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When executeInBatches is called', () => {
    it('should batch process of all items', async () => {
      await service.executeInBatches(items, processBatch, 100);

      // We expect processBatch to be called 3 times (because batchSize is 100)
      expect(processBatch).toHaveBeenCalledTimes(3);
    });

    it('should await delay before processing next batch', async () => {
      jest.spyOn(service, 'delay' as any).mockResolvedValueOnce(null);

      await service.executeInBatches(items, processBatch, 100);

      // Check if delay was called correctly
      expect(service['delay']).toHaveBeenCalledTimes(3);
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers(); // Clean pending timers
    jest.useRealTimers(); // Restore timers
  });
});
