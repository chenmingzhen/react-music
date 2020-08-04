import React from "react";
import { createSong } from "../../assets/js/song";
import { formatDuration } from "../../util/util";
import "./_style.scss";
import { Spin } from "antd";
import axios from "axios";
import { highlightWord } from "../../util/util";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { setPlayList, setCurrentIndex } from "../player/store/actionCreator";
import { connect } from "react-redux";
import { message } from "antd";
class SongList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { song: [] };
    this._tmp = [];
  }

  async componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    if (this.props.needGet) {
      for (const item of this.props.songList) {
        await new Promise((res) => {
          createSong(item, this.source.token)
            .then((data) => {
              /*let tmp = [...this.state.song];
              tmp.push(data);
              this.setState({ song: tmp });
              res();*/
              let t = [...this._tmp];
              t.push(data);
              this._tmp = t;
              res();
            })
            .catch((e) => {});
        });
      }
      this.setState({ song: this._tmp });
    } else {
      console.log(this.props.songList);
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
                        onClick={() => {
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
                  />
                  {needAlbum ? (
                    <div
                      className="album"
                      dangerouslySetInnerHTML={{
                        __html: highlightWord(item.album.name, search),
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
