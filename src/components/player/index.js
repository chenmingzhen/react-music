import React from "react";
import "./_style.scss";
import { connect } from "react-redux";
import { Popover } from "antd";
import {
  setCurrentIndex,
  setFullScreen,
  setPlaying,
  setPlayList,
} from "./store/actionCreator";
import { formatDuration } from "../../util/util";
import ProgressBar from "../progressBar";
import { withRouter } from "react-router-dom";
class Player extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: 0,
      songPercent: 0,
      volumePercent: 1,
      songReady: false,
    };
  }
  render() {
    return (
      <div className="player-wrapper">
        <div className="normal-wrapper"></div>
        {this.renderMini()}
        {this.renderAudio()}
      </div>
    );
  }

  renderMini() {
    const { playlist, currentIndex, playing, fullScreen } = this.props;
    const { songPercent, volumePercent, currentTime } = this.state;
    return (
      <div className="mini-wrapper">
        <div className="song-wrapper">
          <div className="img-wrapper">
            {playlist.length > 0 && (
              <img src={playlist[currentIndex].image} alt="" />
            )}
            {fullScreen ? (
              <i className={"iconfont icon-weibiaoti11"} />
            ) : (
              <i className={"iconfont icon-quanping"} />
            )}
          </div>
          {playlist.length > 0 && (
            <div className="text-wrapper">
              <div className="inf-wrapper">
                <div className="song-name">{playlist[currentIndex].name}</div>
                <div
                  className="singer-name"
                  onClick={() => {
                    this.props.history.push({
                      pathname:
                        "/singer/singerdetail/" +
                        playlist[currentIndex].album.artists[0].id,
                    });
                  }}
                >
                  -{playlist[currentIndex].singer}
                </div>
              </div>
              <div className="time">
                <div className="current">
                  {formatDuration(currentTime * 1000)}
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
            <i
              className={
                playing ? "iconfont icon-zanting" : "iconfont icon-bofang"
              }
              onClick={this.clickPlayOrPause.bind(this)}
            />
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
            <Popover content={"喜欢"} trigger="hover">
              <i className={"iconfont icon-xihuan"} />
            </Popover>
          </span>
          <span>
            <Popover content={"顺序播放"} trigger="hover">
              <i className={"iconfont icon-shunxubofang"} />
            </Popover>
          </span>
          <span>
            <Popover content={"打开列表"} trigger="hover">
              <i className={"iconfont icon-liebiao"} />
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
    const { songReady } = this.state;
    if (!songReady) return;
    if (playlist.length === 1) {
      //循环播放
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
  }

  next() {
    const { playlist, currentIndex, setCurrentIndex, playing } = this.props;
    const { songReady } = this.state;
    if (!songReady) return;
    if (playlist.length === 1) {
      //循环播放
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
    this.setState({ songReady: false });
  }

  ready() {
    this.setState({ songReady: true });
    setTimeout(() => {
      this.togglePlaying();
    });
  }

  clickPlayOrPause() {
    const { setPlaying, playing } = this.props;
    setPlaying(!playing);
    setTimeout(() => {
      this.props.playing ? this.refs.audio.play() : this.refs.audio.pause();
    });
  }

  togglePlaying() {
    const { setPlaying } = this.props;
    if (!this.state.songReady) {
      return;
    }
    setPlaying(true);
  }
}

const mapState = (state) => ({
  playlist: state.getIn(["player", "playlist"]).toJS(),
  currentIndex: state.getIn(["player", "currentIndex"]),
  fullScreen: state.getIn(["player", "fullScreen"]),
  playing: state.getIn(["player", "playing"]),
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
