import React from "react";
import Carousel from "../../components/carousel";
import "./_style.scss";
import { changeLoading, setUser } from "../../store/actionCreator";
import { connect } from "react-redux";
import axios from "axios";
import { getSinger } from "../../api/singer";
import { Spin } from "antd";
import BackTop from "../../components/backTop";

class Singer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentInitial: "热门",
      currentArea: "全部",
      currentGender: "全部",
      offset: 0,
      singerList: [],
      showMore: false,
    };
    this.initial = [
      "热门",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    this.area = ["全部", "华语", "欧美", "日本", "韩国", "其他"];
    this.gender = ["全部", "男", "女", "组合"];
  }

  componentDidMount() {
    this.props.changeLoadingDone(true);
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();

    getSinger(this.getParams(), this.source.token).then((data) => {
      this.setState({ singerList: data.artists });
    });
  }

  render() {
    return (
      <div className={"singer-wrapper"}>
        {this.renderTop()}
        {this.renderSelect()}
        {this.renderSinger()}
        {this.renderMore()}
        <BackTop ele={"content-wrapper"} scrollStepInPx="100" delayInMs="10" />
      </div>
    );
  }

  renderTop() {
    const { user } = this.props;
    return (
      <div className={"top-wrapper"}>
        <img
          src={require("../../assets/img/bg_singer.jpg")}
          alt=""
          loading={"lazy"}
        />
        {user.code ? (
          <div className="carousel-wrapper">
            <div className={"text-wrapper"}>
              <div className={"text"}>我关注的歌手</div>
              <div className={"text-more"}>更多</div>
            </div>
            <Carousel />
          </div>
        ) : (
          <>
            <div className="text-wrapper">
              <div className="title">万千歌手，尽在眼前</div>
              <div className="subtitle">登录查看你关注的歌手</div>
              <span className="button">立即登录</span>
            </div>
          </>
        )}
      </div>
    );
  }

  renderSelect() {
    const { currentInitial, currentArea, currentGender } = this.state;
    return (
      <div className="select-wrapper">
        <div className="initial-wrapper">
          {this.initial.map((item, index) => {
            return (
              <span
                className={
                  currentInitial === item
                    ? "initial-item active"
                    : "initial-item"
                }
                key={item + "_" + index}
                onClick={this.clickSelectItem.bind(this, "initial", item)}
              >
                {item}
              </span>
            );
          })}
        </div>
        <div className="area-wrapper">
          {this.area.map((item, index) => {
            return (
              <span
                className={
                  currentArea === item ? "area-item active" : "area-item"
                }
                key={item + "_" + index}
                onClick={this.clickSelectItem.bind(this, "area", item)}
              >
                {item}
              </span>
            );
          })}
        </div>
        <div className="gender-wrapper">
          {this.gender.map((item, index) => {
            return (
              <span
                className={
                  currentGender === item ? "gender-item active" : "gender-item"
                }
                key={item + "_" + index}
                onClick={this.clickSelectItem.bind(this, "gender", item)}
              >
                {item}
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  renderSinger() {
    const { singerList } = this.state;
    return (
      <div className={"singer-select-wrapper"}>
        {singerList.length > 0
          ? singerList.map((item, index) => {
              return (
                <div
                  className={"singer-item"}
                  key={index}
                  onClick={() => {
                    this.props.history.push({
                      pathname: "/singer/singerdetail/" + item.id,
                    });
                  }}
                >
                  <div className="img-wrapper">
                    <img src={item.picUrl} title={item.name} alt={item.name} />
                  </div>
                  <div className="name" title={item.name}>
                    {item.name}
                  </div>
                </div>
              );
            })
          : this.renderSpin()}
      </div>
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

  renderMore() {
    const { showMore, singerList } = this.state;
    return (
      <div className={"more-wrapper"}>
        {showMore ? (
          this.renderSpin()
        ) : singerList.length > 0 ? (
          <div className={"more"} onClick={this.getMore.bind(this)}>
            加载更多
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
  }

  clickSelectItem(content, item) {
    this.setState({ singerList: [], offset: 0 });
    switch (content) {
      case "initial":
        this.setState({ currentInitial: item });
        break;
      case "area":
        this.setState({ currentArea: item });
        break;
      case "gender":
        this.setState({ currentGender: item });
        break;
      default:
        break;
    }
    //异步setState 需要等待state更新
    setTimeout(() => {
      getSinger(this.getParams(), this.source.token).then((data) => {
        this.setState({ singerList: data.artists });
      });
    });
  }

  getParams() {
    const { currentInitial, currentArea, currentGender, offset } = this.state;
    let initial, area, type;
    if (currentInitial === "热门") {
      initial = -1;
    } else {
      initial = currentInitial;
    }
    switch (currentGender) {
      case "全部":
        type = -1;
        break;
      case "男":
        type = 1;
        break;
      case "女":
        type = 2;
        break;
      case "组合":
        type = 3;
        break;
      default:
        type = -1;
        break;
    }
    switch (currentArea) {
      case "全部":
        area = -1;
        break;
      case "华语":
        area = 7;
        break;
      case "欧美":
        area = 96;
        break;
      case "日本":
        area = 8;
        break;
      case "韩国":
        area = 16;
        break;
      case "其他":
        area = 0;
        break;
      default:
        area = -1;
        break;
    }
    return { area, type, initial, offset: offset * 30 };
  }

  getMore() {
    const { offset, singerList } = this.state;
    this.setState({ offset: offset + 1, showMore: true });
    setTimeout(() => {
      getSinger(this.getParams(), this.source.token).then((data) => {
        singerList.concat(data.artists);
        let tmp = [].concat(singerList, data.artists);
        this.setState({ singerList: tmp, showMore: false });
      });
    });
  }
}

const mapState = (state) => ({
  loading: state.getIn(["app", "loading"]),
  user: state.getIn(["app", "user"]),
});

const mapDispatch = (dispatch) => ({
  changeLoadingDone(result) {
    dispatch(changeLoading(result));
  },
  setUser(user) {
    dispatch(setUser(user));
  },
});

export default connect(mapState, mapDispatch)(Singer);
