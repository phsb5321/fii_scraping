import { YahooQueueController } from '@/modules/yahoo/controllers/yahoo-queue-controller/yahoo-queue-controller.controller';
import { Test, TestingModule } from '@nestjs/testing';
describe('YahooQueueController', () => {
  let controller: YahooQueueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YahooQueueController],
    }).compile();

    controller = module.get<YahooQueueController>(YahooQueueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
