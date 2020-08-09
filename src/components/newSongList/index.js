import React from "react";
import { AddZero } from "../../assets/js/util";
import { renderSpin } from "../../util/renderSpin";
import "./_style.scss";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { setCurrentIndex, setPlayList } from "../player/store/actionCreator";
import { createSong } from "../../assets/js/song";

class NewSongList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      newSongList: [],
    };
    this._tmp = [];
  }

  async componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    if (this.props.newSongList.length > 0) {
      for (const item of this.props.newSongList) {
        await new Promise((res) => {
          createSong(item, this.source.token)
            .then((data) => {
              let t = [...this._tmp];
              t.push(data);
              this._tmp = t;
              res();
            })
            .catch(() => {});
        });
      }
      this.setState({ newSongList: this._tmp });
    }
  }

  render() {
    const { newSongList } = this.state;
    if (newSongList.length > 0) {
      return (
        <div className={"new-song-list-wrapper"}>
          {newSongList.map((item, index) => {
            return (
              <div
                className={"new-song-list-item-wrapper"}
                key={index}
                onClick={this.clickItem.bind(this, newSongList, index)}
              >
                <div className="rank">{AddZero(index)}</div>
                <div className={"img-wrapper"}>
                  <img src={item.image} alt="" loading="lazy" />
                  <i className={"iconfont icon-bofang"} />
                </div>
                <div className="text-wrapper">
                  <p className="name">{item.name}</p>
                  <p className="singer">{item.singer}</p>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    return renderSpin();
  }

  clickItem(playlist, currentIndex) {
    const { setPlaylist, setCurrentIndex } = this.props;
    setPlaylist(playlist);
    setCurrentIndex(currentIndex);
  }
}

NewSongList.propTypes = {
  newSongList: PropTypes.array.isRequired,
};
NewSongList.defaultProps = {
  newSongList: [],
};

const mapState = (state) => ({
  playlist: state.getIn(["player", "playlist"]),
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

export default connect(mapState, mapDispatch)(NewSongList);
