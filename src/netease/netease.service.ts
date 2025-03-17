import { Injectable } from '@nestjs/common';
import { Song } from 'src/interfaces/common.interface';
import { Request } from 'express';
import {
  NeteaseSong,
  NeteaseUrl,
  NeteaseLyric,
  NeteasePlaylist,
} from 'src/interfaces/netease.interface';

@Injectable()
export class NeteaseService {
  constructor() {}

  async findSong(request: Request, id: string): Promise<Song> {
    return fetch('http://music.163.com/api/v3/song/detail/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        c: JSON.stringify([{ id: id, v: 0 }]),
      }),
    })
      .then((response) => response.json())
      .then((json: NeteaseSong) => {
        const song = json.songs[0];
        return {
          title: song.name,
          author: song.ar[0].name,
          pic: song.al.picUrl,
          url: `${request.protocol}://${request.get('host')}/netease/url/${id}`,
          lrc: `${request.protocol}://${request.get('host')}/netease/lrc/${id}`,
        };
      })
      .catch((error) => {
        console.error(error);
        throw new Error('Failed to fetch song');
      });
  }

  async findUrl(id: string): Promise<Blob> {
    return fetch('http://music.163.com/api/song/enhance/player/url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        ids: JSON.stringify([id]),
        br: `${320 * 1000}`,
      }),
    })
      .then((response) => response.json())
      .then((json: NeteaseUrl) => {
        return fetch(json.data[0].url).then((response) => response.blob());
      })
      .catch((error) => {
        console.error(error);
        throw new Error('Failed to fetch url');
      });
  }

  async findLrc(id: string): Promise<string> {
    return fetch('http://music.163.com/api/song/lyric', {
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
    })
      .then((response) => response.json())
      .then((json: NeteaseLyric) => json.lrc.lyric)
      .catch((error) => {
        console.error(error);
        throw new Error('Failed to fetch lrc');
      });
  }

  async findPlaylist(request: Request, id: string): Promise<Song[]> {
    return fetch('http://music.163.com/api/v6/playlist/detail', {
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
    })
      .then((response) => response.json())
      .then((json: NeteasePlaylist) => {
        return json.playlist.tracks.map((song) => ({
          title: song.name,
          author: song.ar[0].name,
          pic: song.al.picUrl,
          url: `${request.protocol}://${request.get('host')}/netease/url/${song.id}`,
          lrc: `${request.protocol}://${request.get('host')}/netease/lrc/${song.id}`,
        }));
      })
      .catch((error) => {
        console.error(error);
        throw new Error('Failed to fetch playlist');
      });
  }
}
