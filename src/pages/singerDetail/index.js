import React from "react";
import { getSingerDesc, getSingerInf, subSinger } from "../../api/singer";
import axios from "axios";
import "./_style.scss";
import { Popover, Spin } from "antd";
import ChartList from "../../components/chartList";
import AlbumList from "../../components/albumList";
import MvList from "../../components/mvList/singerMvList";
import BackTop from "../../components/backTop";
import { getOnlyHash } from "../../assets/js/util";
import { message } from "antd";
class singerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artist: {},
      hotSongs: [],
      moreDesc: {},
      showAllSong: false,
      albumList: [],
      chartListKey: getOnlyHash(15),
      followed: false,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    getSingerInf(id, this.source.token).then((data) => {
      this.setState({
        artist: data.artist,
        hotSongs: data.hotSongs,
        followed: data.artist.followed,
      });
    });
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { id } = this.props.match.params;
    if (id !== nextProps.match.params.id) {
      setTimeout(() => {
        getSingerInf(nextProps.match.params.id, this.source.token).then(
          (data) => {
            this.setState({ artist: data.artist, hotSongs: data.hotSongs });
          }
        );
      });
    }
    return true;
  }

  render() {
    return (
      <div className={"singer-detail-wrapper"}>
        {this.renderInf()}
        {this.renderHotSongList()}
        {this.renderAlbumList()}
        {this.renderMvList()}
        <BackTop ele={"content-wrapper"} scrollStepInPx="100" delayInMs="10" />
      </div>
    );
  }

  renderInf() {
    const { artist, followed } = this.state;
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
            <a href="#hot-song-wrapper">
              <div className="song">
                单曲 <strong title={"单曲"}>{artist.musicSize}</strong>
              </div>
            </a>
            <a href="#album-wrapper">
              <div className="album">
                专辑 <strong title={"专辑"}>{artist.albumSize}</strong>
              </div>
            </a>
            <a href="#mv-wrapper">
              <div className="mv">
                Mv <strong title={"Mv"}>{artist.mvSize}</strong>
              </div>
            </a>
          </div>
          <div className="button-wrapper">
            <div
              className="play-all"
              onClick={() => {
                this.child.playAll();
              }}
            >
              <i className={"iconfont icon-bofang"} />
              播放全部
            </div>
            {!followed ? (
              <div
                className="subscribe"
                onClick={this.handleSubscribe.bind(this, artist.id, 1)}
              >
                <i className={"iconfont icon-collection-b"} />
                收藏歌手
              </div>
            ) : (
              <div
                className="unsubscribe"
                onClick={this.handleSubscribe.bind(this, artist.id, 0)}
              >
                <i className={"iconfont icon-collection-b"} />
                取消收藏
              </div>
            )}
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
    const { hotSongs, showAllSong, chartListKey } = this.state;
    if (hotSongs.length === 0) return;
    return (
      <div className={"hot-song-wrapper"} id={"hot-song-wrapper"}>
        <div className="text-wrapper">
          <div className={"title"}>热门歌曲</div>
          <div
            className={"more"}
            onClick={() => {
              setTimeout(() => {
                this.setState({
                  showAllSong: !showAllSong,
                  chartListKey: getOnlyHash(15),
                });
              });
            }}
          >
            {showAllSong ? "<收起" : "更多>"}
          </div>
        </div>
        <ChartList
          dataLists={showAllSong ? hotSongs : hotSongs.slice(0, 10)}
          key={chartListKey}
          onRef={(ref) => {
            this.child = ref;
          }}
        />
      </div>
    );
  }

  renderAlbumList() {
    const { artist } = this.state;
    const { id } = this.props.match.params;
    return (
      <div className={"album-wrapper"} id={"album-wrapper"}>
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
      <div className={"mv-wrapper"} id={"mv-wrapper"}>
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

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
  }

  getMoreInf() {
    //const { moreDesc } = this.state;
    const { id } = this.props.match.params;
    /*if (moreDesc.code && moreDesc.code === 200) {
      return "";
    }*/
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

  handleSubscribe(id, t) {
    const { followed } = this.state;
    subSinger(id, t, this.source.token).then((data) => {
      if (data && data.code === 200) {
        this.setState({ followed: !followed });
        message.success("操作成功 数据存在延误！！");
      }
    });
  }
}

export default singerDetail;
