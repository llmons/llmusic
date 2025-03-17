import { Injectable } from '@nestjs/common';
import { TencentPlaylist, TencentSong } from 'src/interfaces/tencent.interface';
import { Song } from 'src/interfaces/common.interface';
import { Request } from 'express';

@Injectable()
export class TencentService {
  constructor() {}

  async findSong(request: Request, mid: string): Promise<Song> {
    const params = new URLSearchParams({
      songmid: mid,
      platform: 'yqq',
      format: 'json',
    });

    return fetch(
      `https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?${params.toString()}`,
    )
      .then((response) => response.json())
      .then((json: TencentSong) => {
        const song = json.data[0];
        return {
          title: song.name,
          author: song.singer[0].name,
          pic: '',
          url: `${request.protocol}://${request.get('host')}/tencent/url/${mid}`,
          lrc: `${request.protocol}://${request.get('host')}/tencent/lrc/${mid}`,
        };
      })
      .catch((error) => {
        console.error(error);
        throw new Error('Failed to fetch song');
      });
  }

  async findUrl(mid: string) {
    const params = new URLSearchParams({
      songmid: mid,
      platform: 'yqq',
      format: 'json',
    });

    return fetch(
      `https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?${params.toString()}`,
    )
      .then((response) => response.json())
      .then((json: TencentSong) => {
        const song = json.data[0];
        console.log(song);
        return new Blob();
      })
      .catch((error) => {
        console.error(error);
        throw new Error('Failed to fetch song');
      });
  }

  async findLrc(mid: string) {
    const params = new URLSearchParams({
      songmid: mid,
      platform: 'yqq',
      format: 'json',
    });

    return fetch(
      `https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg?${params.toString()}`,
    )
      .then((response) => response.json())
      .then((json: TencentSong) => {
        const song = json.data[0];
        console.log(song);
        return '';
      })
      .catch((error) => {
        console.error(error);
        throw new Error('Failed to fetch song');
      });
  }

  async findPlaylist(request: Request, id: string) {
    const params = new URLSearchParams({
      id: id,
      format: 'json',
      newsong: '1',
      platform: 'yqq',
    });
    return fetch(
      `https://c.y.qq.com/v8/fcg-bin/fcg_v8_playlist_cp.fcg?${params.toString()}`,
    )
      .then((response) => response.json())
      .then((json: TencentPlaylist) => {
        return json.data.cdlist[0].songlist.map((song) => {
          return {
            title: song.name,
            author: song.singer[0].name,
            pic: '',
            url: `${request.protocol}://${request.get('host')}/tencent/url/${song.mid}`,
            lrc: `${request.protocol}://${request.get('host')}/tencent/lrc/${song.mid}`,
          };
        });
      })
      .catch((error) => {
        console.error(error);
        throw new Error('Failed to fetch playlist');
      });
  }
}
