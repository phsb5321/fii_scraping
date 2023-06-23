// src/modules/b3/controllers/b3-controller/b3-controller.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { B3ControllerController } from './b3-controller.controller';
import { B3Service } from '@/modules/b3/services/b3.service';

describe('B3ControllerController', () => {
  let controller: B3ControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [B3ControllerController],
      providers: [
        // provide a mock B3Service
        {
          provide: B3Service,
          useValue: {
            scrape_all_stocks: jest.fn(),
            create_jobs_for_all_stocks: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<B3ControllerController>(B3ControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
