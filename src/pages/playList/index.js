import React from "react";
import { getPlayList } from "../../api/playlist";
import { timestampToTime } from "../../util/util";
import "./_style.scss";
import { changeLoading } from "../../store/actionCreator";
import { connect } from "react-redux";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import SongList from "../../components/songList";
import Comment from "../../components/comment";
import axios from "axios";

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

class PlayList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listData: {},
      id: Number,
      status: 1,
    };
  }

  getData() {
    getPlayList(this.props.match.params.id, this.source.token)
      .then((data) => {
        this.setState(() => ({
          listData: data.playlist,
          id: this.props.match.params.id,
        }));
        this.props.changeLoadingDone(true);
      })
      .catch((e) => {});
  }

  UNSAFE_componentWillMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (
      nextProps.match.params.id === this.state.id &&
      this.state.listData.id &&
      nextState.status === this.state.status
    ) {
      return false;
    }
    this.props.changeLoadingDone(false);
    return true;
  }

  render() {
    this.getData();
    let data = this.state.listData;
    if (data.creator && String(data.id) === this.props.match.params.id) {
      return (
        <div className={"self-playlist-wrapper"}>
          <div className={"detail-wrapper"}>
            <div className={"img-wrapper"}>
              <img src={data.coverImgUrl} alt="" loading="lazy" />
            </div>
            <div className="text-wrapper">
              <div className="title-wrapper">
                <div className="list">歌单</div>
                <div className="name">{data.name}</div>
              </div>
              <div className="creator-wrapper">
                <div className={"img-wrapper"}>
                  <img src={data.creator.avatarUrl} alt="" loading="lazy" />
                </div>
                <div className="name">{data.creator.nickname}</div>
                <div className="time">
                  {timestampToTime(data.createTime)}创建
                </div>
              </div>
              <div className="play-all">播放全部</div>
              <div className="tag">
                {data.tags.map((item, index) => {
                  return item + "/";
                })}
              </div>
              <div className="count">
                歌曲数:{" ".replace(/ /g, "\u00a0")}
                {data.trackCount}
                {"   ".replace(/ /g, "\u00a0")}
                播放数:{" ".replace(/ /g, "\u00a0")}
                {data.playCount}
              </div>
              <div className="resume">简介:{data.description}</div>
            </div>
          </div>
          <div className={"select-wrapper"}>
            <div
              className={this.state.status === 1 ? "song active" : "song"}
              onClick={() => {
                this.setState({ status: 1 });
              }}
            >
              歌曲列表
            </div>
            <div
              className={this.state.status === 2 ? "comment active" : "comment"}
              onClick={() => {
                this.setState({ status: 2 });
              }}
            >
              评论({data.commentCount})
            </div>
          </div>
          {this.state.status === 1 ? (
            <div>
              <SongList songList={this.state.listData.tracks} />
            </div>
          ) : (
            <Comment listId={this.state.listData.id} />
          )}
        </div>
      );
    } else {
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
          <Spin tip={"loading"} indicator={antIcon} />
        </div>
      );
    }
  }

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
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
});

export default connect(mapState, mapDispatch)(PlayList);
