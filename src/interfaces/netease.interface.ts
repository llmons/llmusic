export interface NeteaseSong {
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
}

export interface NeteaseSongResponse {
  songs: NeteaseSong[];
}

export interface NeteasePlaylistResponse {
  playlist: {
    tracks: NeteaseSong[];
  };
}
