import { getNewSong } from "../../api/recommend";
import React from "react";
import { AddZero } from "../../assets/js/util";
import { Spin } from "antd";
import { createSong } from "../../assets/js/song";
import "./_style.scss";

class NewSongList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
    };
  }

  componentDidMount() {
    getNewSong().then((data) => {
      data.result.forEach((item, index) => {
        createSong(item.song).then((data) => {
          const listData = [...this.state.listData];
          listData.push(data);
          this.setState({ listData });
        });
      });
    });
  }

  render() {
    if (this.state.listData.length > 0) {
      return (
        <div className={"new-song-list-wrapper"}>
          {this.state.listData.map((item, index) => {
            return (
              <div className={"new-song-list-item-wrapper"} key={index}>
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
    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Spin></Spin>
      </div>
    );
  }
}

export default NewSongList;
