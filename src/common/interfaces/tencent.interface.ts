export interface TencentLrc {
  lyric: string;
}

export interface TencentPlaylist {
  data: {
    cdlist: [
      {
        songlist: TencentSong['data'];
      },
    ];
  };
}

export interface TencentSong {
  data: [
    {
      album: {
        mid: string;
        name: string;
      };
      name: string;
      singer: [
        {
          name: string;
        },
      ];
      mid: string;
    },
  ];
}

export interface TencentUrl {
  req_0: {
    data: {
      sip: [string];
      midurlinfo: [
        {
          purl: string;
        },
      ];
    };
  };
}
