export interface NeteaseLyric {
  lrc: {
    lyric: string;
  };
}

export interface NeteasePlaylist {
  playlist: {
    trackIds: [
      {
        id: number;
      },
    ];
  };
}

export interface NeteaseSong {
  songs: [
    {
      name: string;
      id: number;
      ar: [
        {
          name: string;
        },
      ];
      al: {
        picUrl: string;
      };
    },
  ];
}

export interface NeteaseUrl {
  data: [
    {
      url: string;
    },
  ];
}
