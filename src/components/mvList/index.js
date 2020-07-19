import React from "react";

import "./_style.scss";
import { Spin } from "antd";
import { getRecommendMv } from "../../api/recommend";
import { createMv } from "../../assets/js/mv";

class MvList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mvData: [],
    };
  }

  componentDidMount() {
    getRecommendMv().then((data) => {
      data.result.forEach((item, index) => {
        const mvData = [...this.state.mvData];
        mvData.push(createMv(item));
        this.setState(() => ({ mvData }));
      });
    });
  }

  render() {
    if (this.state.mvData) {
      return (
        <div className={"mv-list-wrapper"}>
          {this.state.mvData &&
            this.state.mvData.map((item, index) => {
              return (
                <div className={"mv-item"} key={index}>
                  <div className="img-wrapper">
                    <img src={item.picUrl} alt="" loading="lazy"/>
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
        <Spin></Spin>
      </div>
    );
  }
}

export default MvList;
