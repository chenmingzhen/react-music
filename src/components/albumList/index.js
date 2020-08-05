import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import axios from "axios";
import { getSingerAlbum } from "../../api/singer";
import "./_style.scss";
import { timestampToTime } from "../../util/util";
import { Spin } from "antd";
import { withRouter } from "react-router-dom";

class AlbumList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      albumLists: [],
      moreAlbum: true,
      offset: 0,
      albumLoading: true,
    };
  }

  componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    this.getAlbumLists();
    if (this.props.onRef) this.props.onRef(this);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { id } = this.props;
    if (id !== nextProps.id) {
      setTimeout(() => {
        this.setState({ albumLoading: true });
        getSingerAlbum(nextProps.id, 10, 0, this.source.token).then((data) => {
          let tmp = data.hotAlbums;
          this.setState({
            albumLists: tmp,
            moreAlbum: data.more,
            offset: 1,
            albumLoading: false,
          });
        });
      });
    }
    return true;
  }

  render() {
    const { albumLists, moreAlbum, albumLoading } = this.state;
    return (
      <>
        <TransitionGroup className={"album-list-wrapper"}>
          {albumLists.map((item, index) => {
            return (
              <CSSTransition
                timeout={700}
                classNames="upIn"
                unmountOnExit
                key={index}
              >
                <div
                  className={"album-item"}
                  onClick={() => {
                    this.props.history.push({
                      pathname: "/albumdetail/" + item.id,
                    });
                  }}
                >
                  <div className="img-wrapper">
                    <img src={item.picUrl} alt="" />
                    <i className={"iconfont icon-bofang"} />
                  </div>
                  <div className={"album-name"} title={item.name}>
                    {item.name}
                  </div>
                  <div className={"time"}>
                    {timestampToTime(item.publishTime)}
                  </div>
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
        {albumLoading ? this.renderSpin() : ""}
        <div
          className="showMore"
          onClick={() => {
            this.getAlbumLists();
          }}
        >
          {moreAlbum ? "加载更多专辑👇" : "🚀加载完毕🚀"}
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

  getAlbumLists() {
    const { id } = this.props;
    const { offset } = this.state;
    this.setState({ albumLoading: true });
    getSingerAlbum(id, 10, offset * 10, this.source.token).then((data) => {
      let tmp = [...this.state.albumLists].concat(data.hotAlbums);
      this.setState({
        albumLists: tmp,
        moreAlbum: data.more,
        offset: offset + 1,
        albumLoading: false,
      });
    });
  }
}

export default withRouter(AlbumList);
