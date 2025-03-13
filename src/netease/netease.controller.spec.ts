import { Test, TestingModule } from '@nestjs/testing';
import { NeteaseController } from './netease.controller';

describe('NeteaseController', () => {
  let controller: NeteaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NeteaseController],
    }).compile();

    controller = module.get<NeteaseController>(NeteaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
