import React from "react";
import "./_style.scss";
import { connect } from "react-redux";
import {
  changeSearchStatus,
  setCurrentHeaderIndex,
  setHeaderStatus,
  changeLoading,
} from "../../store/actionCreator";
import { Popover } from "antd";
import Skin from "../skin";
import { withRouter } from "react-router-dom";

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: ["个性推荐", "每日歌曲推荐", "歌单", "排行榜", "歌手", "最新音乐"],
      dots: [
        {
          font: "iconfont  icon-shouye",
          color: "#ff5652",
        },
        { font: "iconfont icon-suoxiao", color: "#ffb63c" },
        {
          font: "iconfont icon-quanping last-icon",
          color: "#00c34c",
        },
      ],
    };
  }

  render() {
    return (
      <div className={"header-wrapper"}>
        <div className={"header-left"}>
          <div className="navigation">
            {
              //条件渲染dots
              this.state.dots.map((item, index) => {
                return (
                  <span
                    className={"dot"}
                    style={{ background: item.color }}
                    key={index}
                  >
                    <i className={item.font} style={{ color: "#1e1e1e" }} />
                  </span>
                );
              })
            }
          </div>
          <div className="arrow-wrapper">
            <span
              className="arrow-left"
              onClick={this.props.history.goBack.bind(this)}
            >
              <i className={"iconfont icon-youjiantou left"} />
            </span>
            <span
              className="arrow-right"
              onClick={this.props.history.goForward.bind(this)}
            >
              <i className={"iconfont icon-youjiantou"} />
            </span>
          </div>
        </div>
        <div className={"header-right"}>
          <div className="title-wrapper">
            {
              /*条件渲染title*/
              this.state.title.map((item, index) => {
                return (
                  <span
                    key={index}
                    onClick={this.clickTitle.bind(this, index)}
                    className={
                      this.props.currentHeaderIndex === index &&
                      this.props.headerStatus === true
                        ? "active"
                        : ""
                    }
                  >
                    {item}
                  </span>
                );
              })
            }
          </div>
          <div
            className="search-wrapper"
            onFocus={() => {
              this.props.changeSearchStatus(true);
            }}
            onBlur={() => {
              this.props.changeSearchStatus(false);
            }}
          >
            <div className="search">
              <i className={"iconfont icon-chazhao"} />
              <input type="text" placeholder={"搜索"} />
            </div>
            <Popover placement="bottomRight" content={<Skin />} trigger="click">
              <i className={"iconfont icon-yifu change-skin"} />
            </Popover>
          </div>
        </div>
      </div>
    );
  }

  clickTitle(index) {
    this.props.setHeaderStatus(true);
    this.props.changeLoading(false);
    switch (index) {
      case 0:
        this.props.changeIndex(0);
        this.props.history.push({ pathname: "/discovery" });
        break;
      case 1:
        this.props.changeIndex(1);
        this.props.history.push({ pathname: "/dailyrecommend" });
        break;
      case 2:
        this.props.changeIndex(2);
        this.props.history.push({ pathname: "/songsheet" });
        break;
      default:
        break;
    }
  }
}

const mapState = (state) => ({
  searchStatus: state.getIn(["app", "searchStatus"]),
  loading: state.getIn(["app", "searchStatus"]),
  currentHeaderIndex: state.getIn(["app", "currentHeaderIndex"]),
  headerStatus: state.getIn(["app", "headerStatus"]),
});

const mapDispatch = (dispatch) => ({
  changeSearchStatus(result) {
    dispatch(changeSearchStatus(result));
  },
  changeIndex(index) {
    dispatch(setCurrentHeaderIndex(index));
  },
  setHeaderStatus(status) {
    dispatch(setHeaderStatus(status));
  },
  changeLoading(result) {
    dispatch(changeLoading(result));
  },
});

export default withRouter(connect(mapState, mapDispatch)(Header));
