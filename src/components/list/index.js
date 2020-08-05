import React from "react";
import SongList from "../songList";
import { connect } from "react-redux";
import "./_style.scss";
import classnames from "classnames";
import { getLocalStorage, removeLocalStorage } from "../../util/localStorage";
class List extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tab: 1,
      historyList: [],
    };
  }

  render() {
    const { tab, historyList } = this.state;
    const { playlist } = this.props;
    return (
      <div className="list-wrapper">
        <div className={"tab-wrapper"}>
          <span
            className={classnames({ tab: true, active: this.state.tab === 1 })}
            onClick={(e) => {
              e.nativeEvent.stopImmediatePropagation();
              this.setState({ tab: 1 });
            }}
          >
            播放列表
          </span>
          <span
            className={classnames({ tab: true, active: this.state.tab === 2 })}
            onClick={(e) => {
              e.nativeEvent.stopImmediatePropagation();
              this.setState({ tab: 2 });
            }}
          >
            历史记录
          </span>
        </div>
        <div className={"title-wrapper"}>
          <div className={"number"}>
            总共:
            {tab === 1 ? playlist.length : historyList.length}首
          </div>
          {tab === 2 && (
            <div className={"clean-wrapper"}>
              <i className={"iconfont icon-lajitong"} />
              <span
                className={"text"}
                onClick={() => {
                  removeLocalStorage("_playlist_history");
                }}
              >
                清空
              </span>
            </div>
          )}
        </div>
        <div className={"song-wrapper"}>{this.renderSongList()}</div>
      </div>
    );
  }

  renderSongList() {
    const { tab, historyList } = this.state;
    const { playlist } = this.props;
    if (tab === 1) {
      if (playlist.length === 0)
        return <div style={{ textAlign: "center" }}>暂无列表</div>;
      return <SongList needAlbum={false} songList={playlist} needGet={false} />;
    } else {
      if (historyList.length === 0)
        return <div style={{ textAlign: "center" }}>暂无列表</div>;
      return (
        <SongList needAlbum={false} songList={historyList} needGet={false} />
      );
    }
  }

  componentDidMount() {
    let historyList = getLocalStorage("_playlist_history");
    if (historyList === null) historyList = [];
    this.setState({ historyList });
  }
}

const mapState = (state) => ({
  playlist: state.getIn(["player", "playlist"]).toJS(),
  currentIndex: state.getIn(["player", "currentIndex"]),
});

export default connect(mapState, null)(List);
