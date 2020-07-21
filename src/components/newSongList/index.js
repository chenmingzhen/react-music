import React from "react";
import { AddZero } from "../../assets/js/util";
import { Spin } from "antd";
import "./_style.scss";
import PropTypes from "prop-types";

class NewSongList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.newSongList.length > 0) {
      return (
        <div className={"new-song-list-wrapper"}>
          {this.props.newSongList.map((item, index) => {
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

NewSongList.propTypes = {
  newSongList: PropTypes.array.isRequired,
};
NewSongList.defaultProps = {
  newSongList: [],
};
export default NewSongList;
