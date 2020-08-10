import React from "react";
import axios from "axios";
import { getUserInf } from "../../api/login";
import { connect } from "react-redux";
import {
  getPlayList,
  getSubAlbum,
  getSubscribeSinger,
} from "../../api/selfInfomation";
import { message } from "antd";
import { renderSpin } from "../../util/renderSpin";
import "./_style.scss";
import { getOnlyHash } from "../../assets/js/util";
import classnames from "classnames";
import { timestampToTime } from "../../util/util";

class UserInf extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      playList: {},
      subAlbum: {},
      subscribeSinger: {},
      tab: 0,
    };
  }

  componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    const { user } = this.props;
    if (!user || !user.account || !user.account.id) {
      this.props.history.replace({ pathname: "/discovery" });
      return;
    }
    this.getData();
  }

  render() {
    const { userData, playList, subAlbum, subscribeSinger, tab } = this.state;
    if (userData === null) return renderSpin();
    return (
      <div className={"user-inf-wrapper"}>
        <div className={"profile-wrapper"}>
          <div
            className={"profile-bg"}
            /*style={{
                                      background: `url(${userData.profile.backgroundUrl}) 50% 0 no-repeat`,
                                    }}*/
            style={{
              background: `url(${userData.profile.backgroundUrl})`,
              backgroundSize: "100%",
            }}
          />
          <div className={"img-wrapper"}>
            <img
              src={userData.profile.avatarUrl}
              alt={userData.profile.nickname}
            />
          </div>
          <div className={"name"}>{userData.profile.nickname}</div>
        </div>
        <div className={"nav-wrapper"}>
          <div
            className={classnames({ "nav-item": true, active: tab === 0 })}
            onClick={() => {
              this.setState({ tab: 0 });
            }}
          >
            <span className={"text"}>歌单</span>
            <span className={"count"}>{playList.length}</span>
          </div>
          <div
            className={classnames({ "nav-item": true, active: tab === 1 })}
            onClick={() => {
              this.setState({ tab: 1 });
            }}
          >
            <span className={"text"}>专辑</span>
            <span className={"count"}>{subAlbum.length}</span>
          </div>
          <div
            className={classnames({ "nav-item": true, active: tab === 2 })}
            onClick={() => {
              this.setState({ tab: 2 });
            }}
          >
            <span className={"text"}>歌手</span>
            <span className={"count"}>{subscribeSinger.length}</span>
          </div>
        </div>
        {tab === 0 && (
          <div className={"playlist-wrapper"}>
            <div className={"fix-wrapper"}>
              <span className={"title"}>歌单</span>
              <span className={"title"}>数目</span>
              <span className={"title"}>创建人</span>
            </div>
            <div className={"item-wrapper"}>
              {playList.map((item) => {
                return (
                  <div
                    className="item"
                    key={getOnlyHash()}
                    onClick={() => {
                      this.props.history.push({
                        pathname: `/playlist/${item.id}`,
                      });
                    }}
                  >
                    <div className="img-wrapper">
                      <img src={item.coverImgUrl} alt="" />
                    </div>
                    <div className="title">{item.name}</div>
                    <div className="count">{item.trackCount}</div>
                    <div className="creator">{item.creator.nickname}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {tab === 1 && (
          <div className="album-wrapper">
            <div className={"fix-wrapper"}>
              <span className={"title"}>专辑</span>
              <span className={"title"}>数目</span>
              <span className={"title"}>歌手</span>
              <span className={"title"}>收藏时间</span>
            </div>
            <div className="item-wrapper">
              {subAlbum.map((item) => {
                return (
                  <div
                    className={"item"}
                    key={getOnlyHash()}
                    onClick={() => {
                      this.props.history.push({
                        pathname: "/albumdetail/" + item.id,
                      });
                    }}
                  >
                    <div className="img-wrapper">
                      <img src={item.picUrl} alt="" />
                    </div>
                    <div className="title">
                      <div className="original">{item.name}</div>{" "}
                      {item.alias && item.alias[0] && (
                        <div className="trans">({item.alias[0]})</div>
                      )}
                    </div>
                    <div className="count">{item.size}</div>
                    <div className="singer">{item.artists[0].name}</div>
                    <div className="time">{timestampToTime(item.subTime)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {tab === 2 && (
          <div className={"singer-wrapper"}>
            <div className="item-wrapper">
              {subscribeSinger.map((item) => {
                return (
                  <div
                    className="item"
                    key={getOnlyHash()}
                    onClick={() => {
                      this.props.history.push({
                        pathname: "/singer/singerdetail/" + item.id,
                      });
                    }}
                  >
                    <div className="img-wrapper">
                      <img src={item.picUrl} alt="" />
                    </div>
                    <div className="title">
                      <div className="original">{item.name}</div>{" "}
                      {item.trans !== null && (
                        <div className="trans">({item.trans})</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
  }

  async getData() {
    const { user } = this.props;
    const id = user.account.id;
    const p = Promise.all([
      getUserInf(id, this.source.token),
      getPlayList(id, this.source.token),
      getSubAlbum(this.source.token),
      getSubscribeSinger(id, this.source.token),
    ]);
    p.then((array) => {
      console.log(array);
      this.setState({
        userData: array[0],
        playList: array[1].playlist,
        subAlbum: array[2].data,
        subscribeSinger: array[3].data,
      });
    }).catch((e) => {
      message.error("出错啦 请刷新页面再试一次");
    });
  }
}

const mapState = (state) => ({
  user: state.getIn(["app", "user"]),
});

export default connect(mapState, null)(UserInf);
