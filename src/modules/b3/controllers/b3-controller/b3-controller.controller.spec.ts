import { Test, TestingModule } from '@nestjs/testing';
import { B3ControllerController } from './b3-controller.controller';

describe('B3ControllerController', () => {
  let controller: B3ControllerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [B3ControllerController],
    }).compile();

    controller = module.get<B3ControllerController>(B3ControllerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
