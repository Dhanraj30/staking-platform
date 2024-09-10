export interface Pool {
    lptoken: string;
    rwdtoken: string;
    lplogo: string;
    rwlogo: string;
    autocompclass: string;
    autocompound: string;
  }
  
  export const poolDb: Pool[] = [
    {
      lptoken: 'N2DR',
      rwdtoken: 'N2DR',
      lplogo: 'n2dr.png',
      rwlogo: 'n2dr.png',
      autocompclass: 'btn btn-md btn-success',
      autocompound: 'Auto Compound'
    },
    {
      lptoken: 'USDT',
      rwdtoken: 'N2DR',
      lplogo: 'usdt.png',
      rwlogo: 'n2dr.png',
      autocompclass: 'btn btn-md btn-success disabled',
      autocompound: 'Auto Compound Unavailable'
    }
  ];
  