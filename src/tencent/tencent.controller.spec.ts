import { Test, TestingModule } from '@nestjs/testing';
import { TencentController } from './tencent.controller';

describe('TencentController', () => {
  let controller: TencentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TencentController],
    }).compile();

    controller = module.get<TencentController>(TencentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
