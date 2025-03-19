import { HttpException, Injectable, StreamableFile } from '@nestjs/common';
import { Song } from 'src/common/interfaces/common.interface';
import { Request } from 'express';
import {
  NeteaseSong,
  NeteaseUrl,
  NeteaseLyric,
  NeteasePlaylist,
} from 'src/common/interfaces/netease.interface';
import { Readable } from 'stream';

@Injectable()
export class NeteaseService {
  constructor() {}

  async findSong(this: void, request: Request, id: string): Promise<Song> {
    try {
      const response = await fetch('http://music.163.com/api/v3/song/detail/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          c: JSON.stringify([{ id: id, v: 0 }]),
        }),
      });
      const json = (await response.json()) as NeteaseSong;

      const song = json.songs[0];
      return {
        title: song.name,
        author: song.ar[0].name,
        pic: song.al.picUrl,
        url: `${request.protocol}://${request.get('host')}/api/netease/url/${id}`,
        lrc: `${request.protocol}://${request.get('host')}/api/netease/lrc/${id}`,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', 500);
    }
  }

  async findUrl(id: string): Promise<StreamableFile> {
    try {
      const urlResponse = await fetch(
        'http://music.163.com/api/song/enhance/player/url',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            ids: JSON.stringify([id]),
            br: `${320 * 1000}`,
          }),
        },
      );
      const json = (await urlResponse.json()) as NeteaseUrl;
      const url = json.data[0].url;
      if (!url) {
        throw new HttpException('Failed to fetch url', 404);
      }

      // fetch binary file
      const fileResponse = await fetch(url);
      if (!fileResponse.body) {
        throw new Error('fileResponse.body is undefined');
      }

      // transform to stream
      const stream = Readable.from(fileResponse.body);
      return new StreamableFile(stream);
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException('Internal server error', 500);
    }
  }

  async findLrc(id: string): Promise<string> {
    try {
      const response = await fetch('http://music.163.com/api/song/lyric', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          id: id,
          os: 'linux',
          lv: '-1',
          kv: '-1',
          tv: '-1',
        }),
      });
      const json = (await response.json()) as NeteaseLyric;
      return json.lrc.lyric;
    } catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', 500);
    }
  }

  async findPlaylist(request: Request, id: string): Promise<Song[]> {
    try {
      const response = await fetch(
        'http://music.163.com/api/v6/playlist/detail',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            s: '0',
            id: id,
            n: '1000',
            t: '0',
          }),
        },
      );
      const json = (await response.json()) as NeteasePlaylist;
      const songs = await Promise.all(
        json.playlist.trackIds.map(async (track) => {
          const song: Song = await this.findSong(request, track.id.toString());
          return song;
        }),
      );
      return songs;
    } catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', 500);
    }
  }
}
