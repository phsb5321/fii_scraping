import { Test, TestingModule } from '@nestjs/testing';
import { YahooController } from './yahoo.controller';
import { YahooService } from './yahoo.service';

describe('YahooController', () => {
  let controller: YahooController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YahooController],
      providers: [YahooService],
    }).compile();

    controller = module.get<YahooController>(YahooController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
