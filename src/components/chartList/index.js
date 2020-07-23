import React from "react";
import "./_style.scss";
import PropTypes from "prop-types";
import { createSong } from "../../assets/js/song";
import { formatDuration } from "../../util/util";
import axios from "axios";
class ChartList extends React.PureComponent {
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
    this.props.onRef(this);
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
            {item.mvid !== 0 ? (
              <i className={"iconfont icon-shipin"} title="播放MV"></i>
            ) : (
              ""
            )}
            <i className={"iconfont icon-bofang play"} title="播放"></i>
          </div>
          <div className={"singer"}>{item.singer}</div>
          <div className={"duration"}>{formatDuration(item.duration)}</div>
        </div>
      );
    });
  }

  //循环异步
  async getSongLists() {
    this.setState({ songLists: [] });
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
          .catch((e) => {});
      });
    }
  }
}

ChartList.propTypes = {
  songLists: PropTypes.array,
};
ChartList.defaultProps = {
  songLists: [],
};

export default ChartList;
