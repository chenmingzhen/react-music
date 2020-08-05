import React from "react";
import "./_style.scss";
import { createSong } from "../../assets/js/song";
import { formatDuration } from "../../util/util";
import axios from "axios";
import { withRouter } from "react-router-dom";

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

  //貌似有点卡顿了
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { dataLists } = this.props;
    if (dataLists !== nextProps.dataLists) {
      this.getSongLists(nextProps.dataLists);
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
        {songLists.length > 0 ? this.renderItem() : ""}
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
              <img src={item.image} alt="" loading="lazy" />
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
            <i className={"iconfont icon-bofang play"} title="播放" />
          </div>
          <div className={"singer"}>{item.singer}</div>
          <div className={"duration"}>{formatDuration(item.duration)}</div>
        </div>
      );
    });
  }

  //循环异步
  async getSongLists(lists) {
    //要将之前的请求取消 不然来回点击会出现歌曲不对应 不应该出现在这榜单的会出现
    this.source.cancel && this.source.cancel("cancel");
    this.setState({ songLists: [] });
    if (lists !== undefined) {
      for (let i = 0; i < lists.length; i++) {
        await new Promise((res) => {
          createSong(lists[i], this.source.token)
            .then((data) => {
              let tmp = [...this.state.songLists];
              tmp.push(data);
              this.setState({ songLists: tmp });
              res();
            })
            .catch(() => {});
        });
      }
    } else {
      const { dataLists } = this.props;
      for (let i = 0; i < dataLists.length; i++) {
        await new Promise((res) => {
          createSong(dataLists[i], this.source.token)
            .then((data) => {
              let tmp = [...this.state.songLists];
              tmp.push(data);
              this.setState({ songLists: tmp });
              res();
            })
            .catch(() => {});
        });
      }
    }
  }
}

export default withRouter(ChartList);
