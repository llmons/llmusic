import { Injectable } from '@nestjs/common';
import { Song } from './type/song.type';

@Injectable()
export class AppService {
  findSong(id: string): Song {
    return { name: 'song1', artist: `artist1&&${id}` };
  }
}
