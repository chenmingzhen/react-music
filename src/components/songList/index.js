import React from "react";
import { createSong } from "../../assets/js/song";
import { formatDuration, highlightWord } from "../../util/util";
import "./_style.scss";
import { message, Spin } from "antd";
import axios from "axios";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { setCurrentIndex, setPlayList } from "../player/store/actionCreator";
import { connect } from "react-redux";

class SongList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { song: [] };
    this._tmp = [];
  }

  async componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    //绑定给父组件 父组件调用该组件的playAll方法
    if (this.props.onRef) this.props.onRef(this);

    if (this.props.needGet) {
      //for (const item of this.props.songList) {
      //  await new Promise((res) => {
      //    createSong(item, this.source.token)
      //      .then((data) => {
      //        /*let tmp = [...this.state.song];
      //                      tmp.push(data);
      //                      this.setState({ song: tmp });
      //                      res();*/
      //        let t = [...this._tmp];
      //        t.push(data);
      //        this._tmp = t;
      //        res();
      //      })
      //      .catch((e) => {});
      //  });
      //}
      Promise.all(
        this.props.songList.map((item, index) => {
          return new Promise((res) => {
            res(createSong(item, this.source.token));
          });
        })
      ).then((data) => {
        this.setState({ song: data });
      });
      //this.setState({ song: this._tmp });
    } else {
      this.setState({ song: this.props.songList });
    }
  }

  render() {
    let { song } = this.state;
    const { search, needAlbum, currentIndex, playlist } = this.props;
    if (this.props.needGet === false) {
      setTimeout(() => {
        this.setState({ song: this.props.songList });
      });
    }
    if (song.length > 0) {
      return (
        <div className={"song-list-wrapper"} style={this.props.style}>
          <div className="fix-wrapper">
            <div className="title">音乐标题</div>
            <div className="singer">歌手</div>
            {needAlbum ? <div className="album">专辑</div> : ""}
            <div className="time">时长</div>
          </div>
          <div className="list-wrapper">
            {song.map((item, index) => {
              return (
                <div
                  className="list-item"
                  key={index}
                  style={index % 2 === 0 ? { background: "#fafafa" } : {}}
                  onClick={() => {
                    if (item.url === null) {
                      message.error("无权限播放");
                      return;
                    }
                    this.props.setPlaylist(song);
                    this.props.setCurrentIndex(index);
                  }}
                >
                  {playlist.length !== 0 &&
                  playlist[currentIndex].id === item.id ? (
                    <i className={"iconfont icon-laba"} />
                  ) : (
                    <div className={"number"}>
                      {index + 1 < 10 ? "0" + (index + 1) : index + 1}
                    </div>
                  )}
                  <div className="title">
                    {search ? (
                      <span
                        dangerouslySetInnerHTML={{
                          __html: highlightWord(item.name, search),
                        }}
                      />
                    ) : (
                      item.name
                    )}
                    {item.fee === 1 ? <i className="iconfont icon-VIP" /> : ""}
                    {item.mvid !== 0 ? (
                      <i
                        className="iconfont icon-shipin"
                        onClick={(e) => {
                          e.stopPropagation();
                          this.props.history.push({
                            pathname: "/mvplay/" + item.mvid,
                          });
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div
                    className="singer"
                    dangerouslySetInnerHTML={{
                      __html: highlightWord(item.singer, search),
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      let id = 0;
                      if (item.singerId === 0)
                        id = this.props.songList[index].ar[0].id;
                      else id = item.singerId;
                      this.props.history.push({
                        pathname: "/singer/singerdetail/" + id,
                      });
                    }}
                  />
                  {needAlbum ? (
                    <div
                      className="album"
                      dangerouslySetInnerHTML={{
                        __html: highlightWord(item.album.name, search),
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        this.props.history.push({
                          pathname: "/albumdetail/" + item.album.id,
                        });
                      }}
                    />
                  ) : (
                    ""
                  )}
                  <div className="duration">
                    {formatDuration(item.duration)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Spin />
        </div>
      );
    }
  }

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
  }

  playAll() {
    const { song } = this.state;
    if (song.length === 0) {
      message.warn("还没准备好！！！");
      return;
    }
    this.props.setPlaylist(song);
    this.props.setCurrentIndex(0);
  }
}

SongList.propTypes = { needAlbum: PropTypes.bool, needGet: PropTypes.bool };
SongList.defaultProps = { needAlbum: true, needGet: true };

const mapState = (state) => ({
  playlist: state.getIn(["player", "playlist"]).toJS(),
  currentIndex: state.getIn(["player", "currentIndex"]),
});

const mapDispatch = (dispatch) => ({
  setPlaylist(playlist) {
    dispatch(setPlayList(playlist));
  },
  setCurrentIndex(currentIndex) {
    dispatch(setCurrentIndex(currentIndex));
  },
});
export default withRouter(connect(mapState, mapDispatch)(SongList));
