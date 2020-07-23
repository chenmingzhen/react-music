import React from "react";
import { Spin } from "antd";
import PropTypes from "prop-types";
import "./_style.scss";
import { withRouter } from "react-router-dom";
class PlayList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { playListData } = this.props;
    if (playListData.length > 0) {
      return (
        <div className={"playlist-wrapper"}>
          {playListData.map((item, index) => {
            return (
              <div
                className={"playlist-item"}
                key={index}
                onClick={this.clickItem.bind(this, item)}
              >
                <div className="img-wrap">
                  <img
                    src={item.picUrl || item.coverImgUrl}
                    alt="none"
                    loading="lazy"
                  />
                  <div className="desc-wrapper">{item.copywriter}</div>
                  <div className="play-icon-wrapper">
                    <i className={"iconfont icon-bofang"} />
                  </div>
                </div>
                <p className={"text"}>{item.name}</p>
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

  clickItem(item) {
    this.props.history.push({ pathname: `/commentplaylist/${item.id}` });
  }
}

PlayList.propTypes = {
  playListData: PropTypes.array.isRequired,
};
PlayList.defaultProps = {
  playListData: [],
};

export default withRouter(PlayList);
