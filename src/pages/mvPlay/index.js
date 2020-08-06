import React from "react";
import "./_style.scss";
import { getMvUrl } from "../../api/singer";
import { getMvDetail, getMvSimi } from "../../api/mv";
import axios from "axios";
import Comment from "../../components/comment";
import { formatDuration } from "../../util/util";
import BackTop from "../../components/backTop";
import PubSub from "pubsub-js";
class MvPlay extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { mvUrl: "", mvDetail: {}, mvs: [], stateId: Number };
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
  }

  componentDidMount() {
    PubSub.publish("song-pause");
  }

  render() {
    const { id } = this.props.match.params;
    const { mvUrl, mvDetail, stateId } = this.state;
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
            {mvUrl !== "" ? <video controls={"video"} src={mvUrl} /> : ""}
          </div>
          {mvDetail.id ? (
            <>
              <div className="singer-wrapper">
                <div className="avatar">
                  <img
                    src={mvDetail.cover}
                    alt=""
                    onClick={this.clickItem.bind(this)}
                  />
                </div>
                <div className="name" onClick={this.clickItem.bind(this)}>
                  {mvDetail.artistName}
                </div>
              </div>
              <div className="name">{mvDetail.name}</div>
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
        <BackTop ele={"mv-wrapper"} scrollStepInPx="100" delayInMs="10" />
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
                <img src={item.cover} alt="" />
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
    getMvUrl(id, this.source.token).then((data) => {
      if (data !== undefined) this.setState({ mvUrl: data.data.url });
    });
    getMvDetail(id, this.source.token).then((data) => {
      if (data !== undefined) this.setState({ mvDetail: data.data });
    });
    getMvSimi(id, this.source.token).then((data) => {
      if (data !== undefined) this.setState({ mvs: data.mvs });
    });
    this.setState({ stateId: id });
  }

  clickItem() {
    const { mvDetail } = this.state;
    this.props.history.push({
      pathname: "/singer/singerdetail/" + mvDetail.artistId,
    });
  }
}

export default MvPlay;
