import React from "react";
import "./_style.scss";
import { routeBreakUp } from "../../assets/js/util";
import { connect } from "react-redux";
import {
  setCurrentIndex,
  setPlayList,
} from "../../components/player/store/actionCreator";
import { getUserInf } from "../../api/login";
import axios from "axios";
import { getSong, getSongDetail } from "../../api/singer";
import { filterMv, filterSinger, Song } from "../../assets/js/song";
import { message } from "antd";
import { renderSpin } from "../../util/renderSpin";
import classnames from "classnames";
import { changeLoading } from "../../store/actionCreator";
import { Link } from "react-router-dom";
class Shared extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: 0,
      songId: 0,
      msg: "",
      userImg: "",
      song: null,
      nickname: "",
      out: false,
    };
  }

  componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();

    const { search } = this.props.location;
    const routemMap = routeBreakUp(search);

    if (!routemMap.get("songId") || !routemMap.get("userId")) {
      this.props.history.replace({ pathname: "/discocovery" });
      return;
    }

    let msg = "";
    if (routemMap.get("msg")) {
      msg = decodeURI(routemMap.get("msg"));
    }
    //
    this.setState({
      userId: routemMap.get("userId"),
      songId: routemMap.get("songId"),
      msg,
    });

    const userId = routemMap.get("userId");
    const SongId = routemMap.get("songId");
    getUserInf(userId, this.source.token).then((data) => {
      if (data && data.profile)
        this.setState({
          userImg: data.profile.avatarUrl,
          nickname: data.profile.nickname,
        });
    });

    //SONG GET
    (async () => {
      let _url = "";
      await getSong(SongId, this.source.token).then((data) => {
        if (data !== undefined) {
          _url = data.data[0].url;
        }
      });
      let musicData = {};
      await getSongDetail(SongId, this.source.token).then((data) => {
        if (data.songs.length === 0) {
          message.error("SongId gets wrong");
          return;
        }
        musicData = data.songs[0];
      });

      const song = new Song({
        id: musicData.id,
        name: musicData.name,
        ar:
          filterSinger(musicData.ar) ||
          filterSinger(musicData.artists) ||
          musicData.singer,
        al: musicData.al || musicData.album,
        dt: musicData.dt || musicData.duration,
        image: (musicData.al && musicData.al.picUrl) || musicData.album.picUrl,
        url: _url,
        fee: musicData.fee,
        mvid: filterMv(musicData),
      });

      let array = [];
      array.push(song);
      this.setState({ song: array });

      this.props.changeLoadingDone(true);
    })();
  }

  render() {
    const { userImg, nickname, song, msg, out, userId } = this.state;
    return (
      <div className={classnames({ "shared-wrapper": true, out: out })}>
        <div className="inf-wrapper">
          {userImg ? (
            <div className="img-wrapper">
              <Link to={"/userInf?id=" + userId}>
                <img src={userImg} alt="" />
              </Link>
            </div>
          ) : (
            renderSpin()
          )}
          <div className="nickname">{nickname}</div>
          <div className={"text"}>给你分享了</div>
        </div>
        <div
          className="music-case"
          onClick={this.handleClick.bind(this)}
          title={"播放歌曲"}
        >
          <div className="front-case">
            <div className="icon" />
          </div>
          <div className="disc">
            <div className="hole" />
          </div>
          <div className="back-case" />
        </div>
        {song && song.length > 0 ? (
          <div className={"text"}>
            {song[0].name}---{song[0].singer}
          </div>
        ) : (
          renderSpin()
        )}
        <div className={"msg-wrapper"}>{msg}</div>
      </div>
    );
  }

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("CANCEL BY SHARED");
    this.setState = () => false;
  }

  handleClick() {
    const { setPlaylist, setCurrentIndex } = this.props;
    const { song } = this.state;
    if (song.length === 0) {
      message.warn("还没准备好！！！");
      return;
    }
    setPlaylist(song);
    setCurrentIndex(0);
    this.setState({ out: true });
    setTimeout(() => {
      this.props.history.replace({ pathname: "/discovery" });
    }, 700);
  }
}

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
  changeLoadingDone(result) {
    dispatch(changeLoading(result));
  },
});

export default connect(mapState, mapDispatch)(Shared);
