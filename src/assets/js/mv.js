import { getMvUrl } from "../../api/singer";

export class Mv {
  constructor({ id, name, picUrl, playCount, artists, dt, url }) {
    this.id = id;
    this.name = name;
    this.picUrl = picUrl;
    this.playCount = playCount;
    this.artists = artists;
    this.dt = dt;
    if (url) {
      this.url = url;
    }
  }
}

export function createMv(mvData) {
  return new Mv({
    id: mvData.id,
    name: mvData.name,
    picUrl: mvData.picUrl || mvData.imgurl,
    playCount: mvData.playCount,
    artists: mvData.artists,
    dt: mvData.duration,
  });
}

export function createMvWithUrl(mvData, cancelToken) {
  let _url = "";
  getMvUrl(mvData.id, cancelToken).then((data) => {
    _url = data.data.url;
  });

  return new Mv({
    id: mvData.id,
    name: mvData.name,
    picUrl: mvData.picUrl || mvData.imgurl,
    playCount: mvData.playCount,
    artists: mvData.artists,
    dt: mvData.duration,
    url: _url,
  });
}
