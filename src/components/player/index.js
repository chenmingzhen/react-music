import React from "react";
import "./_style.scss";
import { connect } from "react-redux";
import { Popover, message } from "antd";
import {
  setCurrentIndex,
  setFullScreen,
  setPlaying,
  setPlayList,
} from "./store/actionCreator";
import { formatDuration } from "../../util/util";
import ProgressBar from "../progressBar";
import { withRouter } from "react-router-dom";
import {
  getLikeSongListId,
  likeOrDisLikeMusic,
} from "../../api/selfInfomation";
import axios from "axios";
import List from "../list";
import { CSSTransition } from "react-transition-group";
import { getLocalStorage, setLocalStorage } from "../../util/localStorage";
import PubSub from "pubsub-js";
import classnames from "classnames";
import Comment from "../comment";
import Lyric from "lyric-parser";
import LyricScroll from "../lyricScroll";
class Player extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      songPercent: 0,
      volumePercent: 1,
      //songready如果为false则点击前进后退不响应
      songReady: false,
      likeSongListId: [],
      mode: 1,
      listOpen: false,
      dots: 1,
      currentLyric: null,
      currentLineNum: 0,
      playingLyric: "",
    };
  }

  render() {
    const { user } = this.props;
    const { likeSongListId } = this.state;
    if (user.code === 200 && likeSongListId.length === 0) {
      setTimeout(() => {
        this.getLikeMusic();
      });
    }
    return (
      <div className="player-wrapper">
        {this.renderNormal()}
        {this.renderMini()}
        {this.renderAudio()}
        <CSSTransition
          in={this.state.listOpen}
          timeout={400}
          classNames={"rightIn"}
          unmountOnExit
          appear={true}
        >
          <List />
        </CSSTransition>
      </div>
    );
  }

  renderMini() {
    const {
      playlist,
      currentIndex,
      playing,
      fullScreen,
      setFullScreen,
    } = this.props;
    const {
      songPercent,
      volumePercent,
      currentTime,
      mode,
      songReady,
    } = this.state;
    return (
      <div className="mini-wrapper">
        <div className="song-wrapper">
          {playlist.length > 0 && (
            <div
              className="img-wrapper"
              onClick={() => {
                setFullScreen(!fullScreen);
              }}
            >
              <img src={playlist[currentIndex].image} alt="" />
              {fullScreen ? (
                <i className={"iconfont icon-weibiaoti11"} />
              ) : (
                <i className={"iconfont icon-quanping"} />
              )}
            </div>
          )}
          {playlist.length > 0 && (
            <div className="text-wrapper">
              <div className="inf-wrapper">
                <div className="song-name">{playlist[currentIndex].name}</div>
                <div
                  className="singer-name"
                  onClick={this.clickSinger.bind(this)}
                >
                  -{playlist[currentIndex].singer}
                </div>
              </div>
              <div className="time">
                <div className="current">
                  {isNaN(currentTime * 1000)
                    ? "00:00"
                    : formatDuration(currentTime * 1000)}
                </div>
                <div className={"slash"}>/</div>
                <div className="all">
                  {formatDuration(playlist[currentIndex].duration)}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="control-wrapper">
          <span>
            <i
              className={"iconfont icon-houtui"}
              onClick={this.prev.bind(this)}
              title={"上一首"}
            />
          </span>
          <span>
            {songReady ? (
              <i
                className={
                  playing ? "iconfont icon-zanting" : "iconfont icon-bofang"
                }
                onClick={this.clickPlayOrPause.bind(this)}
              />
            ) : (
              <div className="loading" title="歌曲加载中" />
            )}
          </span>
          <span>
            <i
              className={"iconfont icon-qianjin"}
              onClick={this.next.bind(this)}
              title={"下一首"}
            />
          </span>
        </div>
        <div className="mode-wrapper">
          <span>
            <Popover
              content={this.songExistLikeList() ? "取消喜欢" : "喜欢"}
              trigger="hover"
            >
              <i
                className={
                  this.songExistLikeList()
                    ? "iconfont icon-xihuan"
                    : "iconfont icon-xihuan1"
                }
                onClick={this.likeOfDislikeMusic.bind(this)}
              />
            </Popover>
          </span>
          <span>
            <Popover
              content={
                mode === 1 ? "顺序播放" : mode === 2 ? "随机播放" : "单曲循环"
              }
              trigger="hover"
            >
              <i
                className={
                  mode === 1
                    ? "iconfont icon-shunxubofang"
                    : mode === 2
                    ? "iconfont icon-suiji"
                    : "iconfont icon-danqubofang"
                }
                onClick={() => {
                  let _mode = mode + 1;
                  if (_mode === 4) _mode = 1;
                  this.setState({ mode: _mode });
                }}
              />
            </Popover>
          </span>
          <span>
            <Popover content={"打开列表"} trigger="hover">
              <i
                className={"iconfont icon-liebiao"}
                onClick={(e) => {
                  e.nativeEvent.stopImmediatePropagation();
                  this.setState({ listOpen: !this.state.listOpen });
                }}
              />
            </Popover>
          </span>
          <div className="volume-wrapper">
            <i className={"iconfont icon-laba"} />
            <div className="progress-bar-wrapper">
              <ProgressBar
                percentChange={(percent) => {
                  this.handleVolumePercent(percent);
                }}
                percent={volumePercent}
              />
            </div>
          </div>
        </div>
        <div className="progress-bar-wrapper">
          {playlist.length > 0 && (
            <ProgressBar
              percentChange={(percent) => {
                this.handleSongPercent(percent);
              }}
              percent={songPercent}
            />
          )}
        </div>
      </div>
    );
  }

  renderNormal() {
    const { playlist, currentIndex, fullScreen, setFullScreen } = this.props;
    const { dots, currentLyric } = this.state;
    if (playlist.length === 0) return;
    const item = playlist[currentIndex];
    return (
      <CSSTransition
        in={fullScreen}
        timeout={400}
        classNames={"listUp"}
        unmountOnExit
        appear={true}
      >
        <div className="normal-wrapper">
          <div
            className={"bg-wrapper"}
            style={{ backgroundImage: `url(${playlist[currentIndex].image})` }}
          />
          <div className={"bg-mask"} />
          <div className={"content-wrapper"}>
            <div className={"shrink"}>
              <i
                className={"iconfont icon-guanbi"}
                onClick={() => {
                  setFullScreen(false);
                }}
              />
              <div className="dots-wrapper">
                <div
                  className={classnames({ dot: true, active: dots === 1 })}
                  onClick={() => {
                    this.setState({ dots: 1 });
                  }}
                />
                <div
                  className={classnames({ dot: true, active: dots === 2 })}
                  onClick={() => {
                    this.setState({ dots: 2 });
                  }}
                />
              </div>
            </div>
            <div className="middle">
              <div
                className={classnames({
                  "middle-left": true,
                  unactive: dots === 2,
                })}
              >
                <div className={"img-wrapper"}>
                  <img src={item.image} alt="" />
                  <i className={"cd"} />
                </div>
                <div className={"text-wrapper"}>
                  <div className={"inf-wrapper"}>
                    <div className={"name"}>{item.name}</div>
                    <div
                      className={"singer"}
                      onClick={() => {
                        setFullScreen(false);
                        setTimeout(() => {
                          this.clickSinger();
                        }, 800);
                      }}
                    >
                      歌手:{item.singer}
                    </div>
                    <div
                      className={"album"}
                      onClick={() => {
                        setFullScreen(false);
                        setTimeout(() => {
                          this.props.history.push({
                            pathname: "/albumdetail/" + item.album.id,
                          });
                        }, 800);
                      }}
                    >
                      专辑:{item.album.name}
                    </div>
                  </div>
                  {/* <div className={"lyric-wrapper"} /> */}
                  <LyricScroll
                    className={"middle-wrapper"}
                    data={currentLyric && currentLyric.lines}
                    ref={"lyricList"}
                  >
                    <div className="lyric-wrapper">
                      {currentLyric ? (
                        <div>
                          {currentLyric.lines.map((line, index) => {
                            return (
                              <p key={index} ref={"lyricLine"}>
                                {line.txt}
                              </p>
                            );
                          })}
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  </LyricScroll>
                </div>
              </div>
              <div
                className={classnames({
                  "middle-right": true,
                  unactive: dots === 1,
                })}
              >
                <div className={"text-wrapper"}>
                  <div className={"song-name"}>{item.name}</div>
                  <div className={"singer-name"}>歌手:{item.singer}</div>
                </div>
                <div className={"wrapper-content"}>
                  <Comment isList={4} listId={item.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    );
  }

  renderAudio() {
    const { playlist, currentIndex } = this.props;
    if (playlist.length === 0) return;
    setTimeout(() => {
      this.refs.audio.volume = this.state.volumePercent;
    });
    return (
      <audio
        src={playlist[currentIndex].url}
        controls={false}
        autoPlay={true}
        ref={"audio"}
        onTimeUpdate={this.playedPercent.bind(this)}
        id={"audio"}
        onEnded={this.next.bind(this)}
        onCanPlay={this.ready.bind(this)}
      />
    );
  }

  componentDidMount() {
    //侧边栏
    this.listClose = () => {
      this.setState({ listOpen: false });
    };
    document.addEventListener("click", this.listClose);

    this.pauseToken = PubSub.subscribe("song-pause", (e) => {
      if (this.refs.audio && this.refs.audio.pause) {
        this.refs.audio.pause();
        this.props.setPlaying(false);
      }
    });
    this.playToken = PubSub.subscribe("song-play", (e) => {
      if (this.refs.audio && this.refs.audio.play) {
        this.refs.audio.play();
        this.props.setPlaying(true);
      }
    });
    const { user } = this.props;
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    if (user.code !== 200) {
      return;
    } else {
      getLikeSongListId(user.account.id, this.source.token).then((data) => {
        this.setState({ likeSongListId: data.ids });
      });
    }
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.pauseToken);
    PubSub.unsubscribe(this.playToken);
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
  }

  handleSongPercent(percent) {
    const { playlist, currentIndex } = this.props;
    //audio 是秒作单位  时间戳是毫秒
    const currentTime = (playlist[currentIndex].duration / 999) * percent;
    this.setState({ currentTime });
    this.refs.audio.currentTime = currentTime;
  }

  handleVolumePercent(percent) {
    this.setState({ volumePercent: percent });
    if (this.props.playlist.length === 0) return;
    this.refs.audio.volume = percent;
  }

  playedPercent() {
    const { playlist, currentIndex } = this.props;
    setTimeout(() => {
      const audio = document.getElementById("audio");
      this.setState({
        songPercent: audio.currentTime / audio.duration,
        currentTime:
          ((playlist[currentIndex].duration / 999) * audio.currentTime) /
          audio.duration,
      });
    });
  }

  prev() {
    const { playlist, currentIndex, setCurrentIndex, playing } = this.props;
    const { songReady, mode } = this.state;
    if (!songReady) return;
    if (mode === 1) {
      if (playlist.length === 1) {
        //循环播放
        this.loop();
        return;
      } else {
        let index = currentIndex - 1;
        if (index === -1) {
          index = playlist.length - 1;
        }
        setCurrentIndex(index);
        if (!playing) {
          this.togglePlaying();
        }
      }
    } else if (mode === 2) {
      //随机播放
      if (playlist.length === 1) {
        //循环播放
        this.loop();
        return;
      } else {
        this.randomPlay();
      }
    } else {
      //单曲循环
      this.loop();
    }
    setTimeout(() => {
      if (this.props.playlist[this.props.currentIndex].url === null) {
        message.error("无权限播放，切换到下一首");
        this.setState({ songReady: true });
        this.next();
        return;
      }
    });
    this.setState({ songReady: false });
  }

  /*
   *@canPlay 当播放没有权限的歌曲时 携带此参数可以进入next 下一曲
   */
  next(canPlay = false) {
    const { playlist, currentIndex, setCurrentIndex, playing } = this.props;
    const { songReady, mode } = this.state;
    if (!songReady && !canPlay) return;
    //顺序播放
    if (mode === 1) {
      if (playlist.length === 1) {
        //循环播放
        this.loop();
        return;
      } else {
        let index = currentIndex + 1;
        if (index === playlist.length) {
          index = 0;
        }
        setCurrentIndex(index);
        if (!playing) {
          this.togglePlaying();
        }
      }
    } else if (mode === 2) {
      //随机播放
      if (playlist.length === 1) {
        //循环播放
        this.loop();
        return;
      } else {
        this.randomPlay();
      }
    } else {
      //单曲循环
      this.loop();
    }
    setTimeout(() => {
      if (playlist.length === 0) return;
      if (this.props.playlist[this.props.currentIndex].url === null) {
        message.error("无权限播放，切换到下一首");
        this.next(true);
        return;
      }
    });
    this.setState({ songReady: false });
  }

  randomPlay() {
    const { playlist, setCurrentIndex, playing, currentIndex } = this.props;
    let index = Math.round(Math.random() * (playlist.length - 1));
    if (index === currentIndex) index += 1;
    setCurrentIndex(index);
    if (!playing) {
      this.togglePlaying();
    }
  }

  loop() {
    this.refs.audio.currentTime = 0;
    this.refs.audio.play();
  }

  ready() {
    const { playlist, currentIndex } = this.props;
    this.setState({ songReady: true });
    setTimeout(() => {
      this.togglePlaying();
    });
    //设置播放历史
    let historyArray = getLocalStorage("_playlist_history");
    if (historyArray === null) historyArray = [];
    let index = historyArray.findIndex(function (obj) {
      return obj.id === playlist[currentIndex].id;
    });
    if (index !== -1) {
      historyArray.splice(index, 1);
    }
    historyArray.push(playlist[currentIndex]);
    setLocalStorage("_playlist_history", historyArray.reverse());
    PubSub.publish("send-playlist-history", historyArray.reverse());

    //获取歌词
    if (this.state.currentLyric) {
      this.state.currentLyric.stop();
      //FIXME currentTime在这里是什么鬼
      this.setState({ currentTime: 0, playingLyric: "", currentLineNum: 0 });
    }
    setTimeout(() => {
      this.getLyric();
    });
  }

  getLyric() {
    const { playlist, currentIndex, playing } = this.props;
    playlist[currentIndex]
      ._getLyric()
      .then((lyric) => {
        console.log(lyric.lrc.lyric);
        this.setState({
          currentLyric: new Lyric(lyric.lrc.lyric, this.handleLyric.bind(this)),
        });
        if (playing) this.state.currentLyric.play();
      })
      .catch((e) => {
        this.setState({
          currentLyric: null,
          playingLyric: "",
          currentLineNum: 0,
        });
        console.log(e);
      });
  }

  handleLyric({ lineNum, txt }) {
    this.setState({ currentLineNum: lineNum });
    if (lineNum > 5) {
      console.log(">5", this.refs.lyricList);
      let lineEl = this.refs.lyricLine[lineNum - 5];
      this.refs.lyricList.scrollToElement(lineEl, 1000);
    } else {
      console.log("<=5", this.refs.lyricList);
      this.refs.lyricList.scrollTo(0, 0, 1000);
    }
    this.setState({ playingLyric: txt });
  }
  clickPlayOrPause() {
    const { setPlaying, playing } = this.props;
    setPlaying(!playing);
    setTimeout(() => {
      if (this.refs.audio) {
        this.props.playing ? this.refs.audio.play() : this.refs.audio.pause();
      }
    });
  }

  togglePlaying() {
    const { setPlaying } = this.props;
    if (!this.state.songReady) {
      return;
    }
    setPlaying(true);
  }

  getLikeMusic() {
    const { user } = this.props;
    if (user.code !== 200) {
      message.error("尚未登陆");
      return;
    } else {
      getLikeSongListId(user.account.id, this.source.token).then((_data) => {
        this.setState({ likeSongListId: _data.ids });
      });
    }
  }

  likeOfDislikeMusic() {
    const { user, playlist, currentIndex } = this.props;
    if (user.code !== 200) {
      message.error("尚未登陆");
      return;
    } else {
      if (playlist.length > 0) {
        likeOrDisLikeMusic(
          playlist[currentIndex].id,
          !this.songExistLikeList()
        ).then((data) => {
          if (data.code === 200) {
            this.getLikeMusic();
            message.success("操作成功(数据存在延迟)");
          }
        });
      }
    }
  }

  songExistLikeList() {
    const { playlist, currentIndex } = this.props;
    return (
      playlist.length > 0 &&
      this.state.likeSongListId.some(
        (item) => item === playlist[currentIndex].id
      )
    );
  }

  clickSinger() {
    const { playlist, currentIndex } = this.props;
    let id = 0;
    if (playlist[currentIndex].album.artists) {
      id = playlist[currentIndex].album.artists[0].id;
    } else {
      //这个情况返回的id不一定正确
      id = playlist[currentIndex].singerId;
    }
    if (id === 0) return;
    this.props.history.push({
      pathname: "/singer/singerdetail/" + id,
    });
  }
}

const mapState = (state) => ({
  playlist: state.getIn(["player", "playlist"]).toJS(),
  currentIndex: state.getIn(["player", "currentIndex"]),
  fullScreen: state.getIn(["player", "fullScreen"]),
  playing: state.getIn(["player", "playing"]),
  user: state.getIn(["app", "user"]),
});

const mapDispatch = (dispatch) => ({
  setPlaylist(playlist) {
    dispatch(setPlayList(playlist));
  },
  setCurrentIndex(currentIndex) {
    dispatch(setCurrentIndex(currentIndex));
  },
  setFullScreen(result) {
    dispatch(setFullScreen(result));
  },
  setPlaying(result) {
    dispatch(setPlaying(result));
  },
});

export default withRouter(connect(mapState, mapDispatch)(Player));
