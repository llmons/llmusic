import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Song } from './type/song.type';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('song/:id')
  findSong(@Param('id') id: string): Song {
    return this.appService.findSong(id);
  }
}
