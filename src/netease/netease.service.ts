import { Injectable } from '@nestjs/common';
import { Song } from 'src/interfaces/common.interface';
import { Request } from 'express';
import { NeteaseSong } from 'src/interfaces/netease.interface';

@Injectable()
export class NeteaseService {
  constructor() {}

  async findSong(req: Request, id: string): Promise<Song> {
    return fetch(`http://music.163.com/api/song/detail/?ids=[${id}]`)
      .then((response) => response.json())
      .then((data: NeteaseSong) => {
        const song = data.songs[0];
        return {
          title: song.name,
          artist: song.artists[0].name,
          pic: song.album.picUrl,
          file: `${req.protocol}://${req.get('host')}/netease/file/${id}`,
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
}
