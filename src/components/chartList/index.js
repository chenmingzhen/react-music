import React from "react";
import "./_style.scss";
import { createSong } from "../../assets/js/song";
import { formatDuration } from "../../util/util";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { setCurrentIndex, setPlayList } from "../player/store/actionCreator";
import { connect } from "react-redux";
import { isObjectValueEqual } from "../../assets/js/util";
import { renderSpin } from "../../util/renderSpin";
import { message } from "antd";
import { transHttp } from "../../util/util";

class ChartList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songLists: [],
    };
  }

  componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    this.getSongLists();
    if (this.props.onRef) this.props.onRef(this);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.dataLists) {
      if (!isObjectValueEqual(nextProps.dataLists, this.props.dataLists)) {
        setTimeout(() => {
          this.getSongLists(nextProps.dataLists);
        });
        return true;
      }
      if (
        this.props.currentIndex === nextProps.currentIndex &&
        this.props.dataLists.length > 0 &&
        nextProps.dataLists > 0
      ) {
        return false;
      }
    }
    return true;
  }

  render() {
    const { songLists } = this.state;
    return (
      <div className={"chart-list-wrapper"}>
        <div className={"fix-title"}>
          <div className={"title"}>歌曲</div>
          <div className={"singer"}>歌手</div>
          <div className={"duration"}>时长</div>
        </div>
        {songLists.length > 0 ? this.renderItem() : renderSpin()}
      </div>
    );
  }

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
  }

  renderItem() {
    const { songLists } = this.state;
    return songLists.map((item, index) => {
      return (
        <div className={"chart-item"} key={index}>
          <div className={index <= 2 ? "rank hot" : "rank"}>{index + 1}</div>
          <div className={"song-wrapper"}>
            <div className={"img-wrapper"}>
              <img src={transHttp(item.image)} alt="" loading="lazy" />
            </div>
            <div className={"name"}>{item.name}</div>
            {item.fee === 1 ? (
              <i
                className={"iconfont icon-VIP"}
                title="vip歌曲"
                style={{ color: "#c7332f" }}
              />
            ) : (
              ""
            )}
            {item.mvid !== 0 ? (
              <i
                className={"iconfont icon-shipin"}
                title="播放MV"
                onClick={() => {
                  this.props.history.push({ pathname: "/mvplay/" + item.mvid });
                }}
              />
            ) : (
              ""
            )}
            <i
              className={"iconfont icon-bofang play"}
              title="播放"
              onClick={() => {
                const { setPlaylist, setCurrentIndex } = this.props;
                setPlaylist(this.state.songLists);
                setCurrentIndex(index);
              }}
            />
          </div>
          <div
            className={"singer"}
            onClick={(e) => {
              e.stopPropagation();
              let id = 0;
              if (item.singerId === 0)
                id = this.props.dataLists[index].ar[0].id;
              else id = item.singerId;
              this.props.history.push({
                pathname: "/singer/singerdetail/" + id,
              });
            }}
          >
            {item.singer}
          </div>
          <div className={"duration"}>{formatDuration(item.duration)}</div>
        </div>
      );
    });
  }

  //循环异步
  async getSongLists(lists) {
    if (lists !== undefined) {
      Promise.all(
        lists.map((item) => {
          return new Promise((res) => {
            res(createSong(item, this.source.token));
          });
        })
      ).then((data) => {
        this.setState({ songLists: data });
      });
    } else {
      const { dataLists } = this.props;
      Promise.all(
        dataLists.map((item) => {
          return new Promise((res) => {
            res(createSong(item, this.source.token));
          });
        })
      ).then((data) => {
        this.setState({ songLists: data });
      });
    }
  }

  playAll() {
    const { songLists } = this.state;
    if (songLists.length === 0) {
      message.warn("还没准备好！！！");
      return;
    }
    this.props.setPlaylist(songLists);
    this.props.setCurrentIndex(0);
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
});

export default withRouter(connect(mapState, mapDispatch)(ChartList));
