export interface TencentSong {
  data: [
    {
      album: {
        id: number;
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

export interface TencentPlaylist {
  data: {
    cdlist: [
      {
        songlist: TencentSong['data'];
      },
    ];
  };
}
