import React from "react";
import { createSong } from "../../assets/js/song";
import { formatDuration } from "../../util/util";
import "./_style.scss";
import { Spin } from "antd";
import axios from "axios";
import { highlightWord } from "../../util/util";

class SongList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { song: [] };
    this._tmp = [];
  }

  async componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
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
  }

  render() {
    let { song } = this.state;
    const { search } = this.props;
    if (song.length > 0) {
      return (
        <div className={"song-list-wrapper"} style={this.props.style}>
          <div className="fix-wrapper">
            <div className="title">音乐标题</div>
            <div className="singer">歌手</div>
            <div className="album">专辑</div>
            <div className="time">时长</div>
          </div>
          <div className="list-wrapper">
            {song.map((item, index) => {
              return (
                <div
                  className="list-item"
                  key={index}
                  style={index % 2 === 0 ? { background: "#fafafa" } : {}}
                >
                  <div className={"number"}>
                    {index + 1 < 10 ? "0" + (index + 1) : index + 1}
                  </div>
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
                  </div>
                  <div
                    className="singer"
                    dangerouslySetInnerHTML={{
                      __html: highlightWord(item.singer, search),
                    }}
                  />
                  <div
                    className="album"
                    dangerouslySetInnerHTML={{
                      __html: highlightWord(item.album.name, search),
                    }}
                  />
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

export default SongList;
