import { Controller, Get, Header, Param, Req } from '@nestjs/common';
import { NeteaseService } from './netease.service';
import { Song } from 'src/interfaces/common.interface';
import { Request } from 'express';

@Controller('netease')
export class NeteaseController {
  constructor(private readonly neteaseService: NeteaseService) {}

  @Get('song/:id')
  async findSong(@Req() req: Request, @Param('id') id: string): Promise<Song> {
    return this.neteaseService.findSong(req, id);
  }

  @Get('url/:id')
  @Header('Content-Type', 'audio/mpeg')
  async findFile(@Param('id') id: string): Promise<Blob> {
    return this.neteaseService.findFile(id);
  }

  @Get('playlist/:id')
  async findPlaylist(
    @Req() req: Request,
    @Param('id') id: string,
  ): Promise<Song[]> {
    return this.neteaseService.findPlaylist(req, id);
  }
}
