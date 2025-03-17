import { Injectable } from '@nestjs/common';
import { Song } from 'src/interfaces/common.interface';
import { Request } from 'express';
import {
  NeteaseSongResponse,
  NeteasePlaylistResponse,
  NeteaseSong,
} from 'src/interfaces/netease.interface';

@Injectable()
export class NeteaseService {
  constructor() {}

  async findSong(req: Request, id: string): Promise<Song> {
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
      .then((data: NeteaseSongResponse) => {
        const song = data.songs[0];
        return {
          title: song.name,
          author: song.ar[0].name,
          pic: song.al.picUrl,
          url: `${req.protocol}://${req.get('host')}/netease/url/${id}`,
          lrc: `${req.protocol}://${req.get('host')}/netease/lrc/${id}`,
        };
      })
      .catch((error) => {
        console.error(error);
        throw new Error('Failed to fetch song');
      });
  }

  async findFile(id: string): Promise<Blob> {
    return fetch(`https://music.163.com/song/media/outer/url?id=${id}.mp3`)
      .then((response) => response.blob())
      .catch((error) => {
        console.error(error);
        throw new Error('Failed to fetch file');
      });
  }

  async findPlaylist(req: Request, id: string): Promise<Song[]> {
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
      .then((data: NeteasePlaylistResponse) => {
        return data.playlist.tracks.map((song: NeteaseSong) => ({
          title: song.name,
          author: song.ar[0].name,
          pic: song.al.picUrl,
          url: `${req.protocol}://${req.get('host')}/netease/url/${song.id}`,
          lrc: `${req.protocol}://${req.get('host')}/netease/lrc/${song.id}`,
        })) as Song[];
      })
      .catch((error) => {
        console.error(error);
        throw new Error('Failed to fetch playlist');
      });
  }
}
