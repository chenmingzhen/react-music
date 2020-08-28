import React from "react";
import { Spin } from "antd";
import PropTypes from "prop-types";
import "./_style.scss";
import { withRouter } from "react-router-dom";
import { highlightWord } from "../../util/util";
import { transHttp } from "../../util/util";

class SingerList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { singerListData } = this.props;
    if (singerListData.length > 0) {
      return (
        <div className="singerlist-wrapper">
          {singerListData.map((item, index) => {
            return (
              <div
                className="singerlist-item"
                key={index}
                onClick={() => {
                  this.props.history.push({
                    pathname: `/singer/singerdetail/${item.id}`,
                  });
                }}
              >
                <div className="img-wrapper">
                  <img
                    src={
                      transHttp(item.picUrl) ||
                      transHttp(item.coverImgUrl) ||
                      "http://p3.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg?param=130y130"
                    }
                    alt="none"
                    loading="lazy"
                  />
                </div>
                {this.props.search ? (
                  <div
                    className={"text"}
                    dangerouslySetInnerHTML={{
                      __html: highlightWord(item.name, this.props.search),
                    }}
                  />
                ) : (
                  <div className={"text"}>{item.name}</div>
                )}

                {item.trans ? <div className="trans">({item.trans})</div> : ""}
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

SingerList.propTypes = {
  singerListData: PropTypes.array.isRequired,
};
SingerList.defaultProps = {
  singerListData: [],
};

export default withRouter(SingerList);
