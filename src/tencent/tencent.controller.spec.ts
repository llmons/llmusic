import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { TencentController } from './tencent.controller';
import { TencentService } from './tencent.service';

describe('TencentController', () => {
  let controller: TencentController;
  let service: TencentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TencentController],
      providers: [TencentService],
    }).compile();

    controller = module.get<TencentController>(TencentController);
    service = module.get<TencentService>(TencentService);
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
      const result = await controller.findSong(request, '0');

      expect(service.findSong).toHaveBeenCalledWith(request, '0');
      expect(result).toBe(song);
    });

    it('should throw an error', async () => {
      jest.spyOn(service, 'findSong').mockRejectedValue(new Error());

      const request = {} as Request;

      const result = controller.findSong(request, '25638273');

      await expect(result).rejects.toThrow();
    });

    it('should return a song from service with true id', async () => {
      const song = {
        title: '烟火里的尘埃',
        author: '黄霄雲',
        pic: 'https://y.gtimg.cn/music/photo_new/T002R300x300M000001siF050DMS3Z.jpg',
        url: 'http://localhost:3000/api/tencent/url/003npK944YpjPp',
        lrc: 'http://localhost:3000/api/tencent/lrc/003npK944YpjPp',
      };

      const request = {
        protocol: 'http',
        get: jest.fn().mockReturnValue('localhost:3000'),
      } as unknown as Request;

      const result = await service.findSong(request, '003npK944YpjPp');

      expect(result).toStrictEqual(song);
    });

    // it('should return a song from service with false id', async () => {
    //   const request = {
    //     protocol: 'http',
    //     get: jest.fn().mockReturnValue('localhost:3000'),
    //   } as unknown as Request;

    //   const result = await service.findSong(request, '1');

    //   await expect(result).rejects.toThrow(HttpException);
    // });
  });

  // describe('findUrl', () => {
  //   it('should return a streamable file from controller', async () => {
  //     const mockStream = Readable.from(['test']);
  //     const streamableFile = new StreamableFile(mockStream);
  //     jest.spyOn(service, 'findUrl').mockResolvedValue(streamableFile);

  //     const result = await controller.findUrl('25638273');

  //     expect(service.findUrl).toHaveBeenCalledWith('25638273');
  //     expect(result).toStrictEqual({});
  //   });
  // });

  describe('findLrc', () => {
    it('should return a string from controller', async () => {
      const lrc = 'test';
      jest.spyOn(service, 'findLrc').mockResolvedValue(lrc);

      const result = await controller.findLrc('0');

      expect(service.findLrc).toHaveBeenCalledWith('0');
      expect(result).toBe(lrc);
    });

    it('should throw an error', async () => {
      jest.spyOn(service, 'findLrc').mockRejectedValue(new Error());

      const result = controller.findLrc('25638273');

      await expect(result).rejects.toThrow();
    });
  });

  // describe('findPlaylist', () => {
  //   it('should return a song array from controller', async () => {
  //     const songs = [
  //       {
  //         title: 'test',
  //         author: 'test',
  //         pic: 'test',
  //         url: 'test',
  //         lrc: 'test',
  //       },
  //     ] as Song[];
  //     jest.spyOn(service, 'findPlaylist').mockResolvedValue(songs);

  //     const request = {} as Request;
  //     const result = await controller.findPlaylist(request, '8803890208');

  //     expect(service.findPlaylist).toHaveBeenCalledWith(request, '8803890208');
  //     expect(Array.isArray(result)).toBe(true);
  //     expect(result.length).toBeGreaterThanOrEqual(1);
  //   });
  // });
});
