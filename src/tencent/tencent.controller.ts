import {
  Controller,
  Get,
  Header,
  Param,
  Req,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { Song } from 'src/common/interfaces/common.interface';
import { TencentService } from './tencent.service';

@Controller('api/tencent')
@UseInterceptors(ResponseInterceptor)
export class TencentController {
  constructor(private readonly tencentService: TencentService) {}

  @Get('song/:mid')
  @Header('Content-Type', 'application/json; charset=utf-8')
  async findSong(
    @Req() request: Request,
    @Param('mid') mid: string,
  ): Promise<Song> {
    return this.tencentService.findSong(request, mid);
  }

  @Get('url/:mid')
  @Header('Content-Type', 'audio/mp4')
  async findUrl(@Param('mid') mid: string): Promise<StreamableFile> {
    return this.tencentService.findUrl(mid);
  }

  @Get('lrc/:mid')
  @Header('Content-Type', 'application/json; charset=utf-8')
  async findLrc(@Param('mid') mid: string): Promise<string> {
    return this.tencentService.findLrc(mid);
  }

  @Get('playlist/:id')
  @Header('Content-Type', 'application/json; charset=utf-8')
  async findPlaylist(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<Song[]> {
    return this.tencentService.findPlaylist(request, id);
  }
}
