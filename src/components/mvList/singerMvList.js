import React from "react";
import "./singerMvList.scss";
import { Spin } from "antd";
import axios from "axios";
import { getSingerMv } from "../../api/singer";
import { CSSTransition, TransitionGroup } from "react-transition-group";

class SingerMvList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mvLists: [],
      moreMv: true,
      offset: 0,
      mvLoading: true,
    };
  }

  componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    this.getMvLists();
    if (this.props.onRef) this.props.onRef(this);
  }

  render() {
    const { mvLists, moreMv, mvLoading } = this.state;
    return (
      <>
        <TransitionGroup className={"mv-lists-wrapper"}>
          {mvLists.map((item, index) => {
            return (
              <CSSTransition
                timeout={700}
                classNames="upIn"
                unmountOnExit
                key={index}
              >
                <div className={"mv-item"}>
                  <div className="img-wrapper">
                    <img src={item.imgurl} alt="" />
                    <i className={"iconfont icon-bofang"} />
                  </div>
                  <div className={"mv-name"} title={item.name}>
                    {item.name}
                  </div>
                  <div className={"time"}>{item.publishTime}</div>
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
        {mvLoading ? this.renderSpin() : ""}
        <div
          className="showMore"
          onClick={() => {
            this.getMvLists();
          }}
        >
          {moreMv ? "加载更多Mv👇" : "🚀加载完毕🚀"}
        </div>
      </>
    );
  }

  renderSpin() {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Spin />
      </div>
    );
  }

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
  }

  getMvLists() {
    const { id } = this.props;
    const { offset } = this.state;
    this.setState({ mvLoading: true });
    getSingerMv(id, 10, offset * 10, this.source.token).then((data) => {
      if (data) {
        let tmp = [...this.state.mvLists].concat(data.mvs);
        this.setState({
          mvLists: tmp,
          moreMv: data.hasMore,
          offset: offset + 1,
          mvLoading: false,
        });
      }
    });
  }
}

export default SingerMvList;
