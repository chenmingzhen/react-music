import React from "react";
import "./_style.scss";
import { connect } from "react-redux";
import {
  changeLoading,
  changeSearchStatus,
  setCurrentHeaderIndex,
  setHeaderStatus,
  setSearchControl,
} from "../../store/actionCreator";
import { Popover } from "antd";
import Skin from "../skin";
import { withRouter } from "react-router-dom";
import PubSub from "pubsub-js";
import { getLocalStorage, setLocalStorage } from "../../util/localStorage";

class Header extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: ["个性推荐", "每日歌曲推荐", "歌单", "排行榜", "歌手"],
      dots: [
        {
          font: "iconfont  icon-shouye",
          color: "#ff5652",
          onClick: () => {
            this.props.history.push({ pathname: "/discovery" });
          },
        },
        {
          font: "iconfont icon-suoxiao",
          color: "#ffb63c",
          onClick: () => {
            if (document.exitFullscreen) {
              document.exitFullscreen();
            } else if (document.webkitCancelFullScreen) {
              document.webkitCancelFullScreen();
            } else if (document.mozCancelFullScreen) {
              document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
              document.msExitFullscreen();
            }
          },
        },
        {
          font: "iconfont icon-quanping last-icon",
          color: "#00c34c",
          onClick: () => {
            const element = document.documentElement;
            if (element.requestFullscreen) {
              element.requestFullscreen();
            } else if (element.webkitRequestFullScreen) {
              element.webkitRequestFullScreen();
            } else if (element.mozRequestFullScreen) {
              element.mozRequestFullScreen();
            } else if (element.msRequestFullscreen) {
              // IE11
              element.msRequestFullscreen();
            }
          },
        },
      ],
      shadowOn: false,
    };
  }

  componentDidMount() {
    this.shadow = PubSub.subscribe("shadow", (name, result) => {
      this.setState({ shadowOn: result });
    });
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.shadow);
  }

  render() {
    const { setSearchControl } = this.props;
    const { shadowOn } = this.state;
    return (
      <div
        className={"header-wrapper"}
        style={
          shadowOn ? { boxShadow: "0.125rem 0.4rem 0.2rem rgba(0,0,0,.2)" } : {}
        }
      >
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
                    onClick={item.onClick}
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
          <div className="search-wrapper">
            <div className="search">
              <i className={"iconfont icon-chazhao"} title="按回车!!!" />
              <input
                type="text"
                placeholder={"搜索"}
                onKeyPress={this._keyDown}
                onChange={(e) => {
                  PubSub.publish("send-search-value", e.target.value);
                }}
                onClick={(e) => {
                  e.nativeEvent.stopImmediatePropagation();
                  setSearchControl(true);
                }}
              />
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
      case 3:
        this.props.changeIndex(3);
        this.props.history.push({ pathname: "/chart" });
        break;
      case 4:
        this.props.changeIndex(4);
        this.props.history.push({ pathname: "/singer" });
        break;
      default:
        break;
    }
  }

  _keyDown(e) {
    if (e.which === 13) {
      if (e.target.value === "") return;
      let historyArray = getLocalStorage("_search_history");
      if (historyArray === null) historyArray = [];
      //遍历是否已经存在这个查询
      let index = historyArray.findIndex(function (obj) {
        return obj.first === e.target.value;
      });
      //如果存在 先删除再添加
      if (index !== -1) {
        historyArray.splice(index, 1);
      }
      historyArray.push({ first: e.target.value });
      setLocalStorage("_search_history", historyArray);
      PubSub.publish(
        "send-enter",
        getLocalStorage("_search_history").reverse()
      );
    }
  }
}

const mapState = (state) => ({
  searchStatus: state.getIn(["app", "searchStatus"]),
  loading: state.getIn(["app", "searchStatus"]),
  currentHeaderIndex: state.getIn(["app", "currentHeaderIndex"]),
  headerStatus: state.getIn(["app", "headerStatus"]),
  searchControl: state.getIn(["app", "searchControl"]),
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
  setSearchControl(result) {
    dispatch(setSearchControl(result));
  },
});

export default withRouter(connect(mapState, mapDispatch)(Header));
