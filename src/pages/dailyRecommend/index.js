import React from "react";
import { connect } from "react-redux";
import { changeLoading, setUser } from "../../store/actionCreator";
import SongList from "../../components/songList";
import { getDailyRecommend } from "../../api/playlist";
import { Spin } from "antd";
import axios from "axios";
import "./_style.scss";

class DailyRecommend extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
    };
  }

  componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    getDailyRecommend(this.source.token)
      .then((data) => {
        this.setState({ listData: data.recommend });
        this.props.changeLoadingDone(true);
      })
      .catch((e) => {
        this.props.changeLoadingDone(true);
      });
  }

  render() {
    return (
      <div className={"daily-recommend-wrapper"}>
        <div className={"title-wrapper"}>
          <div className={"calendar-wrapper"}>
            <div className={"day"}>{this.translateDay()}</div>
            <div className={"date"}>{new Date().getDate()}</div>
          </div>
          <div className={"text-wrapper"}>
            <div className={"title"}>
              每日歌曲推荐({new Date().toLocaleDateString()})
            </div>
            <div className={"desc"}>根据你的音乐口味生成，每天6:00更新</div>
          </div>
          <div className={"play-all"}>播放全部</div>
        </div>
        {this.renderSongList()}
      </div>
    );
  }

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
  }

  renderSongList() {
    let { listData } = this.state;
    if (!this.props.user.code) {
      return (
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          尚未登录
        </div>
      );
    }
    return (
      <>
        {listData.length > 0 ? (
          <SongList songList={listData}></SongList>
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin></Spin>
          </div>
        )}
      </>
    );
  }

  translateDay() {
    let data = new Date().getDay();
    switch (data) {
      case 1:
        return "星期一";
      case 2:
        return "星期二";
      case 3:
        return "星期三";
      case 4:
        return "星期四";
      case 5:
        return "星期五";
      case 6:
        return "星期六";
      case 0:
        return "星期日";
      default:
        break;
    }
  }
}

const mapState = (state) => ({
  user: state.getIn(["app", "user"]),
  loading: state.getIn(["app", "loading"]),
});
const mapDispatch = (dispatch) => ({
  changeLoadingDone(result) {
    dispatch(changeLoading(result));
  },
  setUser(user) {
    dispatch(setUser(user));
  },
});

export default connect(mapState, mapDispatch)(DailyRecommend);
