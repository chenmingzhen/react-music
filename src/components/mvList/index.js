import React from "react";
import "./_style.scss";
import { Spin } from "antd";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { transHttp } from "../../util/util";

class MvList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (this.props.mvData) {
      return (
        <div className={"mv-list-wrapper"}>
          {this.props.mvData &&
            this.props.mvData.map((item, index) => {
              return (
                <div
                  className={"mv-item"}
                  key={index}
                  onClick={() => {
                    this.props.history.push({ pathname: "/mvplay/" + item.id });
                  }}
                >
                  <div className="img-wrapper">
                    <img src={transHttp(item.picUrl)} alt="" loading="lazy" />
                    <div className="playCount-wrapper">
                      <i className={"iconfont icon-ai-video"} />
                      <p className="playCount"> {item.playCount}</p>
                    </div>
                    <div className="play-icon-wrapper">
                      <i className={"iconfont icon-bofang"} />
                    </div>
                  </div>
                  <p className="name">{item.name}</p>
                  <p className="singer">
                    {item.artists &&
                      item.artists.map((_item, _index) => {
                        if (_index === 0) {
                          return _item.name;
                        } else {
                          return " / " + _item.name;
                        }
                      })}
                  </p>
                </div>
              );
            })}
        </div>
      );
    }
    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Spin />
      </div>
    );
  }
}

MvList.propTypes = {
  mvData: PropTypes.array.isRequired,
};
MvList.defaultProps = {
  mvData: [],
};

export default withRouter(MvList);
