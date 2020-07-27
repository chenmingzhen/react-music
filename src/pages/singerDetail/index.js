import React from "react";
import { getSingerDesc, getSingerInf } from "../../api/singer";
import axios from "axios";
import "./_style.scss";
import { Popover, Spin } from "antd";
import ChartList from "../../components/chartList";
import AlbumList from "../../components/albumList";
import MvList from "../../components/mvList/singerMvList";
class singerDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      artist: {},
      hotSongs: [],
      moreDesc: {},
      showAllSong: false,
      albumList: [],
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    getSingerInf(id, this.source.token).then((data) => {
      this.setState({ artist: data.artist, hotSongs: data.hotSongs });
    });
  }

  render() {
    return (
      <div className={"singer-detail-wrapper"}>
        {this.renderInf()}
        {this.renderHotSongList()}
        {this.renderAlbumList()}
        {this.renderMvList()}
      </div>
    );
  }

  renderInf() {
    const { artist } = this.state;
    if (!artist.id) {
      this.renderSpin();
    }
    return (
      <div className={"singer-inf"}>
        <div className={"img-wrapper"}>
          <img src={artist.picUrl} alt="" title={artist.name} />
        </div>
        <div className="text-wrapper">
          <div className="name" title={artist.name}>
            {artist.name}
            {artist.trans ? `(中文名:${artist.trans})` : ""}
          </div>
          <div className="desc-wrapper">
            <div className="desc">{artist.briefDesc}</div>
            <Popover
              placement="bottomLeft"
              content={this.getMoreInfContent()}
              trigger="click"
            >
              <div
                className="more"
                title={artist.name}
                onClick={this.getMoreInf.bind(this)}
              >
                [更多]
              </div>
            </Popover>
          </div>
          <div className="work">
            <div className="song">
              单曲 <strong title={"单曲"}>{artist.musicSize}</strong>
            </div>
            <div className="album">
              专辑 <strong title={"专辑"}>{artist.albumSize}</strong>
            </div>
            <div className="mv">
              Mv <strong title={"Mv"}>{artist.mvSize}</strong>
            </div>
          </div>
          <div className="button-wrapper">
            <div className="play-all">
              <i className={"iconfont icon-bofang"} />
              播放全部
            </div>
            <div className="subscribe">
              <i className={"iconfont icon-collection-b"} />
              收藏歌手
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderSpin() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Spin />
      </div>
    );
  }

  renderHotSongList() {
    const { hotSongs, showAllSong } = this.state;
    if (hotSongs.length === 0) return;
    return (
      <div className={"hot-song-wrapper"}>
        <div className="text-wrapper">
          <div className={"title"}>热门歌曲</div>
          <div
            className={"more"}
            onClick={() => {
              setTimeout(() => {
                this.setState({ showAllSong: !showAllSong });
                this.chartLists.getSongLists();
              });
            }}
          >
            {showAllSong ? "<收起" : "更多>"}
          </div>
        </div>
        <ChartList
          dataLists={showAllSong ? hotSongs : hotSongs.slice(0, 10)}
          onRef={(ref) => {
            this.chartLists = ref;
          }}
        />
      </div>
    );
  }

  renderAlbumList() {
    const { artist } = this.state;
    const { id } = this.props.match.params;
    return (
      <div className={"album-wrapper"}>
        <div className="text-wrapper">
          <div className={"title"}>
            专辑{"\u00A0"}
            <strong> {artist.albumSize}</strong>
          </div>
        </div>
        <AlbumList id={id} />
      </div>
    );
  }

  renderMvList() {
    const { artist } = this.state;
    const { id } = this.props.match.params;
    return (
      <div className={"album-wrapper"}>
        <div className="text-wrapper">
          <div className={"title"}>
            Mv{"\u00A0"}
            <strong> {artist.mvSize}</strong>
          </div>
        </div>
        <MvList id={id} />
      </div>
    );
  }

  getMoreInf() {
    const { moreDesc } = this.state;
    const { id } = this.props.match.params;
    if (moreDesc.code && moreDesc.code === 200) {
      return "";
    }
    getSingerDesc(id, this.source.token).then((data) => {
      this.setState({ moreDesc: data });
    });
  }

  getMoreInfContent() {
    const { moreDesc } = this.state;
    if (moreDesc.code !== 200) {
      return <Spin />;
    } else {
      return (
        <div
          style={{
            width: "40rem",
            fontSize: "1rem",
            height: "20rem",
            overflow: "auto",
          }}
        >
          <div>
            <span
              style={{ fontSize: "1.2rem", color: "#DC143C", fontWeight: 1000 }}
            >
              简述:
            </span>
            {moreDesc.briefDesc}
          </div>
          {moreDesc.introduction.map((item, index) => {
            return (
              <div key={index}>
                <span
                  style={{
                    fontSize: "1.2rem",
                    color: "#DC143C",
                    fontWeight: 1000,
                  }}
                >
                  {item.ti}:
                </span>
                <span>{item.txt}</span>
              </div>
            );
          })}
        </div>
      );
    }
  }
}

export default singerDetail;