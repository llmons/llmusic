import {
  Controller,
  Get,
  Header,
  Param,
  Req,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { NeteaseService } from './netease.service';
import { Song } from 'src/common/interfaces/common.interface';
import { Request } from 'express';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@Controller('api/netease')
@UseInterceptors(ResponseInterceptor)
export class NeteaseController {
  constructor(private readonly neteaseService: NeteaseService) {}

  @Get('song/:id')
  @Header('Content-Type', 'application/json; charset=utf-8')
  async findSong(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<Song> {
    return this.neteaseService.findSong(request, id);
  }

  @Get('url/:id')
  @Header('Content-Type', 'audio/mpeg')
  async findUrl(@Param('id') id: string): Promise<StreamableFile> {
    return this.neteaseService.findUrl(id);
  }

  @Get('lrc/:id')
  @Header('Content-Type', 'application/json; charset=utf-8')
  async findLrc(@Param('id') id: string): Promise<string> {
    return this.neteaseService.findLrc(id);
  }

  @Get('playlist/:id')
  @Header('Content-Type', 'application/json; charset=utf-8')
  async findPlaylist(
    @Req() request: Request,
    @Param('id') id: string,
  ): Promise<Song[]> {
    return this.neteaseService.findPlaylist(request, id);
  }
}
