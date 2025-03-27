import {
  HttpException,
  Injectable,
  Logger,
  StreamableFile,
} from '@nestjs/common';
import { Request } from 'express';
import { Song } from 'src/common/interfaces/common.interface';
import {
  TencentLrc,
  TencentPlaylist,
  TencentSong,
  TencentUrl,
} from 'src/common/interfaces/tencent.interface';
import { Readable } from 'stream';

@Injectable()
export class TencentService {
  constructor() {}

  async findSong(this: void, request: Request, mid: string): Promise<Song> {
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
        pic: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.album.mid}.jpg`,
        url: `${request.protocol}://${request.get('host')}/api/tencent/url/${mid}`,
        lrc: `${request.protocol}://${request.get('host')}/api/tencent/lrc/${mid}`,
      };
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', 500);
    }
  }

  async findUrl(this: void, mid: string): Promise<StreamableFile> {
    const requestData = {
      req_0: {
        module: 'vkey.GetVkeyServer',
        method: 'CgiGetVkey',
        param: {
          guid: (Math.random() * 10000000).toFixed(0),
          songmid: [mid],
          songtype: [0],
          uin: '',
          loginflag: 1,
          platform: '20',
        },
      },
      comm: {
        uin: '',
        format: 'json',
        ct: 19,
        cv: 0,
        authst: '',
      },
    };

    const params = new URLSearchParams({
      '-': 'getplaysongvkey',
      g_tk: '5381',
      loginUin: '',
      hostUin: '0',
      format: 'json',
      inCharset: 'utf8',
      outCharset: 'utf-8¬ice=0',
      platform: 'yqq.json',
      needNewCode: '0',
      data: JSON.stringify(requestData),
    });

    try {
      const urlResponse = await fetch(
        `https://u.y.qq.com/cgi-bin/musicu.fcg?${params.toString()}`,
      );
      const json = (await urlResponse.json()) as TencentUrl;

      // get purl and domain to combine to gain url
      let purl = '';
      if (json.req_0 && json.req_0.data && json.req_0.data.midurlinfo) {
        purl = json.req_0.data.midurlinfo[0].purl;
      }
      if (!purl) {
        throw new HttpException('Failed to fetch purl', 404);
      }
      const domain = json.req_0.data.sip[0];

      // fetch combined url to get binary file
      const fileResponse = await fetch(`${domain}${purl}`);
      if (!fileResponse.body) {
        throw new HttpException('response body is empty', 500);
      }

      // transform to stream
      const stream = Readable.from(fileResponse.body);
      return new StreamableFile(stream);
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', 500);
    }
  }

  async findLrc(this: void, mid: string) {
    const params = new URLSearchParams({
      songmid: mid,
      pcachetime: Date.now().toString(),
      g_tk: '5381',
      loginUin: '0',
      hostUin: '0',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      notice: '0',
      platform: 'yqq',
      needNewCode: '0',
      format: 'json',
    });

    try {
      const response = await fetch(
        `https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?${params.toString()}`,
        {
          headers: {
            Referer: 'https://y.qq.com',
          },
        },
      );
      const json = (await response.json()) as TencentLrc;
      return Buffer.from(json.lyric, 'base64').toString();
    } catch (error) {
      Logger.error(error);
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
          pic: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.album.mid}.jpg`,
          url: `${request.protocol}://${request.get('host')}/api/tencent/url/${song.mid}`,
          lrc: `${request.protocol}://${request.get('host')}/api/tencent/lrc/${song.mid}`,
        };
      });
    } catch (error) {
      Logger.error(error);
      throw new HttpException('Internal server error', 500);
    }
  }
}
