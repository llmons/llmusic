export interface NeteaseSong {
  songs: [
    {
      name: string;
      artists: [
        {
          name: string;
        },
      ];
      album: {
        picUrl: string;
      };
    },
  ];
}
