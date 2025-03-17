import { Test, TestingModule } from '@nestjs/testing';
import { NeteaseController } from './netease.controller';
import { NeteaseService } from './netease.service';
import { Request } from 'express';

describe('NeteaseController', () => {
  let controller: NeteaseController;
  let service: NeteaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NeteaseController],
      providers: [NeteaseService],
    }).compile();

    controller = module.get<NeteaseController>(NeteaseController);
    service = module.get<NeteaseService>(NeteaseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findSong', () => {
    it('should return a song from controller', async () => {
      const song = {
        title: 'test',
        author: 'test',
        pic: 'test',
        url: 'test',
        lrc: 'test',
      };
      jest.spyOn(service, 'findSong').mockResolvedValue(song);

      const request = {} as Request;

      const result = await controller.findSong(request, '25638273');

      expect(service.findSong).toHaveBeenCalledWith(request, '25638273');
      expect(result).toBe(song);
    });

    it('should throw an error', async () => {
      jest.spyOn(service, 'findSong').mockRejectedValue(new Error());

      const request = {} as Request;

      await expect(controller.findSong(request, '25638273')).rejects.toThrow();
    });

    it('should return a song from service with true id', async () => {
      const song = {
        title: '梦想天空分外蓝',
        author: '陈奕迅',
        pic: 'http://p1.music.126.net/y1hkRJZ5UpNj_K2NLO8AKg==/831230790638810.jpg',
        url: 'http://localhost:3000/netease/url/25638273',
        lrc: 'http://localhost:3000/netease/lrc/25638273',
      };

      const request = {} as Request;

      const result = await service.findSong(request, '25638273');

      expect(result).toBe(song);
    });

    it('should return a song from service with false id', async () => {
      const song = {
        title: 'test',
        author: 'test',
        pic: 'test',
        url: 'test',
        lrc: 'test',
      };

      const request = {} as Request;

      const result = await service.findSong(request, '25638273');

      expect(result).toBe(song);
    });
  });
});
