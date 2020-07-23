import React from "react";
import { getRank } from "../../api/rank";
import axios from "axios";
import { timestampToTime } from "../../util/util";
import ChartList from "../../components/chartList";
import BackTop from "../../components/backTop";
import "./_style.scss";
import { Spin } from "antd";
import { changeLoading } from "../../store/actionCreator";
import { connect } from "react-redux";
//FIXME 出现回流警告
class Chart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playLists: [],
      currentItem: {},
    };
  }
  async componentDidMount() {
    //使用这个方式数据不变
    //let { playLists } = this.state;
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    //循环异步
    for (let i = 0; i < 10; i++) {
      await new Promise((res, rej) => {
        getRank(i, this.source.token).then((data) => {
          const tmp = [...this.state.playLists];
          if (data !== undefined) tmp.push(data.playlist); //设置request的catch后这里出现错误 原因不明 加条件限制
          if (i === 0) {
            this.setState({ playLists: tmp, currentItem: tmp[0] });
          } else this.setState({ playLists: tmp });
          res();
        });
      }).catch((e) => {});
    }

    const { changeLoadingDone } = this.props;
    changeLoadingDone(true);
  }
  render() {
    const { playLists } = this.state;
    return (
      <div className={"chart-wrapper"}>
        <BackTop
          ele={"content-wrapper"}
          scrollStepInPx="100"
          delayInMs="10"
        ></BackTop>
        {playLists.length === 10 ? (
          <>
            {this.renderSlider()}
            {this.renderItem()}
          </>
        ) : (
          this.renderSpin()
        )}
      </div>
    );
  }

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
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

  renderSlider() {
    const { playLists, currentItem } = this.state;
    return (
      <div className={"chart-slider-wrapper"}>
        {playLists.map((item, index) => {
          return (
            <div
              className={
                currentItem.name === item.name
                  ? "chart-slider-item active"
                  : "chart-slider-item"
              }
              key={index}
              onClick={this.clickSliderItem.bind(this, item)}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    );
  }

  renderItem() {
    const { currentItem } = this.state;
    return (
      <>
        {currentItem.name ? (
          <div className={"chart-content-wrapper"}>
            <div className={"top-wrapper"}>
              <div className={"title"}>{currentItem.name}</div>
              <div className={"time"}>
                更新时间:{timestampToTime(currentItem.trackUpdateTime)}
              </div>
            </div>
            {currentItem && currentItem.tracks ? (
              <ChartList
                dataLists={currentItem.tracks}
                onRef={(ref) => {
                  this.child = ref;
                }}
              ></ChartList>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </>
    );
  }

  clickSliderItem(item) {
    this.setState({ currentItem: item });
    /* 调用子组件的方法 */
    setTimeout(() => {
      this.child.getSongLists();
    });
  }
}

const mapState = (state) => ({
  loading: state.getIn(["app", "loading"]),
});
const mapDispatch = (dispatch) => ({
  changeLoadingDone(result) {
    dispatch(changeLoading(result));
  },
});

export default connect(mapState, mapDispatch)(Chart);
