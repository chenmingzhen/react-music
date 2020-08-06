import React from "react";
import "./_style.scss";
import { createSong } from "../../assets/js/song";
import { formatDuration } from "../../util/util";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { setCurrentIndex, setPlayList } from "../player/store/actionCreator";
import { connect } from "react-redux";
import PropTypes from "prop-types";

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
          setTimeout(() => {
            createSong(dataLists[i], this.source.token)
              .then((data) => {
                let tmp = [...this.state.songLists];
                tmp.push(data);
                this.setState({ songLists: tmp });
                res();
              })
              .catch(() => {});
          });
        });
      }
    }
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

ChartList.propTypes = {
  needCancel: PropTypes.bool,
};

ChartList.defaultProps = {
  needCancel: true,
};

export default withRouter(connect(mapState, mapDispatch)(ChartList));
