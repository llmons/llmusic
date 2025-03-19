import { HttpException, Injectable, StreamableFile } from '@nestjs/common';
import {
  TencentPlaylist,
  TencentSong,
} from 'src/common/interfaces/tencent.interface';
import { Song } from 'src/common/interfaces/common.interface';
import { Request } from 'express';
import { Readable } from 'stream';

@Injectable()
export class TencentService {
  constructor() {}

  async findSong(request: Request, mid: string): Promise<Song> {
    const params = new URLSearchParams({
      songmid: mid,
      platform: 'yqq',
      format: 'json',
    });

    try {
      const response = await fetch(
        `https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?${params.toString()}`,
      );
      const json = (await response.json()) as TencentSong;
      const song = json.data[0];

      return {
        title: song.name,
        author: song.singer[0].name,
        pic: `http://imgcache.qq.com/music/photo/album_300/${song.album.id % 100}/300_albumpic_${song.album.id}_0.jpg`,
        url: `${request.protocol}://${request.get('host')}/api/tencent/url/${mid}`,
        lrc: `${request.protocol}://${request.get('host')}/api/tencent/lrc/${mid}`,
      };
    } catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', 500);
    }
  }

  async findUrl(mid: string): Promise<StreamableFile> {
    const params = new URLSearchParams({
      guid: '2802133086',
      vkey: '7180D074FCB8D51AB01BD76E946EC0D1FAC3C6C4EF086834233FF71DB6A7A4773CA2B48F8CE8EE3BF944D03404C892EEEC61D820CFD4B41F__v2b9ab599',
      uin: '1029154073',
      fromtag: '120032',
      src: 'C400001BGoaN18eAZ6.m4a',
    });

    try {
      const response = await fetch(
        `https://ws6.stream.qqmusic.qq.com/C400${mid}.m4a?${params.toString()}`,
      );
      if (!response.body) {
        throw new HttpException('response body is empty', 500);
      }
      const stream = Readable.from(response.body);
      return new StreamableFile(stream);
    } catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', 500);
    }
  }

  async findLrc(mid: string) {
    const params = new URLSearchParams({
      songmid: mid,
      platform: 'yqq',
      format: 'json',
    });

    try {
      const response = await fetch(
        `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?${params.toString()}`,
      );
      const json = (await response.json()) as TencentSong;
      const song = json.data[0];
      console.log(song);
      return '';
    } catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', 500);
    }
  }

  async findPlaylist(request: Request, id: string) {
    const params = new URLSearchParams({
      id: id,
      format: 'json',
      newsong: '1',
      platform: 'yqq',
    });

    try {
      const response = await fetch(
        `https://c.y.qq.com/v8/fcg-bin/fcg_v8_playlist_cp.fcg?${params.toString()}`,
      );
      const json = (await response.json()) as TencentPlaylist;

      return json.data.cdlist[0].songlist.map((song) => {
        return {
          title: song.name,
          author: song.singer[0].name,
          pic: `http://imgcache.qq.com/music/photo/album_300/${song.album.id % 100}/300_albumpic_${song.album.id}_0.jpg`,
          url: `${request.protocol}://${request.get('host')}/api/tencent/url/${song.mid}`,
          lrc: `${request.protocol}://${request.get('host')}/api/tencent/lrc/${song.mid}`,
        };
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('Internal server error', 500);
    }
  }
}
