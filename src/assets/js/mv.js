export class Mv {
    constructor({id, name, picUrl, playCount, artists, dt}) {
        this.id = id;
        this.name = name;
        this.picUrl = picUrl;
        this.playCount = playCount;
        this.artists = artists;
        this.dt = dt;
    }
}

export function createMv(mvData) {

    return new Mv(
        {
            id: mvData.id,
            name: mvData.name,
            picUrl: mvData.picUrl,
            playCount: mvData.playCount,
            artists:mvData.artists,
            dt:mvData.duration
        }
    )
}

