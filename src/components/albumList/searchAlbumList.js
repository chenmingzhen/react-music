import React from "react";
import { Spin } from "antd";
import PropTypes from "prop-types";
import "./_style.scss";
import { withRouter } from "react-router-dom";

class SearchAlbumList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { albumListData } = this.props;
    if (albumListData.length > 0) {
      return (
        <div className={"album-list-wrapper"} style={this.props.style}>
          {albumListData.map((item, index) => {
            return (
              <div
                className={"album-item"}
                onClick={() => {
                  this.props.history.push({
                    pathname: "/albumdetail/" + item.id,
                  });
                }}
                key={index}
              >
                <div className="img-wrapper">
                  <img src={item.picUrl} alt="" />
                  <i className={"iconfont icon-bofang"} />
                </div>
                <div className={"album-name"} title={item.name}>
                  {item.name}
                </div>
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

SearchAlbumList.propTypes = {
  albumListData: PropTypes.array.isRequired,
};
SearchAlbumList.defaultProps = {
  albumListData: [],
};
export default withRouter(SearchAlbumList);
