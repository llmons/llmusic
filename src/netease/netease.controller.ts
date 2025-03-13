import { Controller, Get, Param, Req } from '@nestjs/common';
import { NeteaseService } from './netease.service';
import { Song } from 'src/interfaces/common.interface';
import { Request } from 'express';

@Controller('netease')
export class NeteaseController {
  constructor(private readonly neteaseService: NeteaseService) {}

  @Get('song/:id')
  async indSong(@Req() req: Request, @Param('id') id: string): Promise<Song> {
    return this.neteaseService.findSong(req, id);
  }

  @Get('file/:id')
  async getFile(@Param('id') id: string): Promise<Blob> {
    return this.neteaseService.findFile(id);
  }
}
