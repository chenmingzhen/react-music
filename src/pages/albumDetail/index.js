import React from "react";
import axios from "axios";
import { getAlbumContent } from "../../api/album";
import { timestampToTime } from "../../util/util";
import "./_style.scss";
import ChartList from "../../components/chartList";
import Comment from "../../components/comment";
import { subAlbum, albumDynamic } from "../../api/album";
import { message } from "antd";
class AlbumDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      album: {},
      songs: [],
      hotComments: [],
      isSub: false,
    };
  }

  componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    const { id } = this.props.match.params;
    getAlbumContent(id, this.source.token).then((data) => {
      if (data && data.code === 200) {
        this.setState({ songs: data.songs, album: data.album });
      }
    });
    albumDynamic(id, this.source.token).then((data) => {
      if (data) {
        this.setState({ isSub: data.isSub });
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { id } = this.props.match.params;
    if (id !== nextProps.match.params.id) {
      setTimeout(() => {
        getAlbumContent(nextProps.match.params.id, this.source.token).then(
          (data) => {
            if (data && data.code === 200) {
              this.setState({ songs: data.songs, album: data.album });
            }
          }
        );
        albumDynamic(nextProps.match.params.id, this.source.token).then(
          (data) => {
            if (data) {
              this.setState({ isSub: data.isSub });
            }
          }
        );
      });
    }
    return true;
  }

  render() {
    return (
      <div className={"album-detail-wrapper"}>
        {this.renderTop()}
        {this.renderContent()}
        {this.renderComment()}
      </div>
    );
  }
  renderTop() {
    const { album, isSub } = this.state;
    if (!album.name) return;
    return (
      <div className={"top-wrapper"}>
        <div className="img-wrapper">
          <img src={album.picUrl} alt="" />
          <i className={"cd"} />
        </div>
        <div className="text-wrapper">
          <div className="title">
            <div className="name">{album.name}</div>
            <div className="sub" onClick={this._subAlbum.bind(this)}>
              {isSub ? "取消收藏" : "收藏"}
            </div>
          </div>
          <div className="singer-wrapper">
            <div className="avatar-wrapper">
              <img
                src={album.artist.picUrl}
                alt=""
                onClick={this.clickSinger.bind(this, album.artist.id)}
              />
            </div>
            <div
              className="name"
              onClick={this.clickSinger.bind(this, album.artist.id)}
            >
              {album.artist.name}
            </div>
          </div>
          <div className="detail">
            <div className="time">
              发布时间:{timestampToTime(album.publishTime)}
            </div>
            <div className="company">唱片公司:{album.company}</div>
            <div className="type">类型:{album.subType}</div>
          </div>
        </div>
      </div>
    );
  }
  renderContent() {
    const { songs, album } = this.state;
    if (songs.length === 0) return;
    return (
      <div className={"content-wrapper"}>
        <div className="song-wrapper">
          <ChartList dataLists={songs} />
        </div>
        <div className="content-wrapper">
          <p>简介:</p>
          {album.description}
        </div>
      </div>
    );
  }
  renderComment() {
    const { id } = this.props.match.params;
    return (
      <div>
        <Comment listId={id} isList={2} />
      </div>
    );
  }

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
  }

  clickSinger(id) {
    this.props.history.push({ pathname: "/singer/singerdetail/" + id });
  }

  _subAlbum() {
    //连续解构
    const {
      album: { id },
      isSub,
    } = this.state;
    let t = 1;
    if (isSub === true) t = 2;
    subAlbum(id, t, this.source.token).then((data) => {
      if (data && data.code === 200) {
        message.success("操作成功，数据存在延迟");
        this.setState({ isSub: !isSub });
      }
    });
  }
}

export default AlbumDetail;
