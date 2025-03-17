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

export interface NeteaseLyric {
  lrc: {
    lyric: string;
  };
}

export interface NeteasePlaylist {
  playlist: {
    tracks: [
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
  };
}
