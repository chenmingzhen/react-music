import React from "react";
import "./_style.scss";
import { getMvUrl } from "../../api/singer";
import { getMvDetail, getMvSimi, getsubMv, subMv } from "../../api/mv";
import axios from "axios";
import Comment from "../../components/comment";
import { formatDuration } from "../../util/util";
import BackTop from "../../components/backTop";
import PubSub from "pubsub-js";
import { connect } from "react-redux";
import { message } from "antd";
import { transHttp } from "../../util/util";

class MvPlay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mvUrl: "",
      mvDetail: {},
      mvs: [],
      stateId: Number,
      subMvId: null,
      isSub: false,
    };
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { user: currentUser } = this.props;
    const { user: nextUser } = nextProps;
    if (!currentUser.account && nextUser.account) {
      setTimeout(() => {
        this.getSubMv();
      });
    }
    return true;
  }

  componentDidMount() {
    PubSub.publish("song-pause");
    this.getSubMv();
  }

  render() {
    const { id } = this.props.match.params;
    const { mvUrl, mvDetail, stateId, isSub } = this.state;
    if (stateId !== id) {
      // render中执行setstate会警告 添加异步去除警告
      setTimeout(() => {
        this.getData();
      });
    }
    return (
      <div className={"mv-wrapper"} id={"mv-wrapper"}>
        <div className="left-wrapper">
          <div className={"title"}>mv 详情</div>
          <div className="video-wrapper">
            {mvUrl !== "" ? (
              <video controls={"video"} src={transHttp(mvUrl)} />
            ) : (
              ""
            )}
          </div>
          {mvDetail.id ? (
            <>
              <div className="singer-wrapper">
                <div className="avatar">
                  <img
                    src={transHttp(mvDetail.cover)}
                    alt=""
                    onClick={this.clickItem.bind(this)}
                  />
                </div>
                <div className="name" onClick={this.clickItem.bind(this)}>
                  {mvDetail.artistName}
                </div>
              </div>
              <div className="title-wrapper">
                <div className="name">{mvDetail.name}</div>
                <div className="sub" onClick={this.subMv.bind(this)}>
                  {isSub ? "取消收藏" : "收藏"}
                </div>
              </div>
              <div className="mv-inf">
                <div className="time">发布时间:{mvDetail.publishTime}</div>
                <div className="count">播放量:{mvDetail.playCount}</div>
              </div>
            </>
          ) : (
            ""
          )}
          <Comment listId={id} isList={3} />
        </div>
        <div className="right-wrapper">{this.renderSimi()}</div>
        <BackTop ele={"content-wrapper"} scrollStepInPx="100" delayInMs="10" />
      </div>
    );
  }

  componentWillUnmount() {
    PubSub.publish("song-play");
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
  }

  renderSimi() {
    const { mvs } = this.state;
    if (mvs.length === 0) return "";
    return (
      <div className={"simi-wrapper"}>
        <div className="title">相似 推荐</div>
        {mvs.map((item, index) => {
          return (
            <div
              className="simi-item"
              key={index}
              onClick={() => {
                this.props.history.push({
                  pathname: "/mvplay/" + item.id,
                });
                setTimeout(() => {
                  this.getData();
                });
              }}
            >
              <div className="img-wrapper">
                <img src={transHttp(item.cover)} alt="" />
                <div className="time">{formatDuration(item.duration)}</div>
                <i className={"iconfont icon-bofang center"} />
                <div className="count">
                  <i className={"iconfont icon-ai-video top"} />
                  <div className="number">{item.playCount}</div>
                </div>
              </div>
              <div className="text-wrapper">
                <div className="name">{item.name}</div>
                <div className="singer">{item.artistName}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  getData() {
    this.setState(() => false);
    const { id } = this.props.match.params;
    const { subMvId } = this.state;
    getMvUrl(id, this.source.token).then((data) => {
      if (data !== undefined) this.setState({ mvUrl: data.data.url });
    });
    getMvDetail(id, this.source.token).then((data) => {
      if (data !== undefined) this.setState({ mvDetail: data.data });
    });
    getMvSimi(id, this.source.token).then((data) => {
      if (data !== undefined) this.setState({ mvs: data.mvs });
    });
    this.setState({
      stateId: id,
      isSub: subMvId && subMvId.some((item) => item === id),
    });
  }

  getSubMv() {
    const { user } = this.props;
    const { stateId } = this.state;
    if (!user.code) return;
    getsubMv(this.source.token).then((subMvList) => {
      if (subMvList) {
        this.setState({
          subMvId: subMvList.data.map(({ vid }) => vid),
          isSub: subMvList.data.some(({ vid }) => vid === stateId),
        });
      }
    });
  }

  clickItem() {
    const { mvDetail } = this.state;
    this.props.history.push({
      pathname: "/singer/singerdetail/" + mvDetail.artistId,
    });
  }

  subMv() {
    const { subMvId, stateId, isSub } = this.state;
    const { user } = this.props;
    let t = 1;
    if (!user.code) {
      message.error("尚未登陆");
      return;
    }
    if (subMvId.some((item) => item === stateId)) t = 2;
    subMv(stateId, t, this.source.token).then((data) => {
      if (data && data.code === 200) {
        message.success("操作成功，数据存在延迟");
        this.setState({ isSub: !isSub });
      }
    });
  }
}

const mapState = (state) => ({
  user: state.getIn(["app", "user"]),
});
export default connect(mapState, null)(MvPlay);
