import React from "react";
import axios from "axios";
import { getUserInf } from "../../api/login";
import { connect } from "react-redux";
import {
  getPlayList,
  getSubAlbum,
  getSubscribeSinger,
  subUser,
  userFollow,
} from "../../api/selfInfomation";
import { message } from "antd";
import { renderSpin } from "../../util/renderSpin";
import "./_style.scss";
import { getOnlyHash, routeBreakUp } from "../../assets/js/util";
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
      id: null,
      followed: false,
      userFollow: [],
    };
  }

  componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();

    const { search } = this.props.location;
    const routeMap = routeBreakUp(search);
    if (routeMap.get("id")) {
      //非本人查看
      this.setState({ id: routeMap.get("id") });
    } else {
      //仅本人可见
      const { user } = this.props;
      if (!user || !user.account || !user.account.id) {
        this.props.history.replace({ pathname: "/discovery" });
        return;
      }
    }
    setTimeout(() => {
      this.getData();
    });
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const currentRouteMap = routeBreakUp(this.props.location.search);
    const nextRouteMap = routeBreakUp(nextProps.location.search);
    const currentId = currentRouteMap.get("id");
    const nextId = nextRouteMap.get("id");
    if (currentId && nextId && currentId !== nextId) {
      setTimeout(() => {
        this.setState({
          id: nextId,
          userData: null,
          playList: [],
          subAlbum: [],
          subscribeSinger: [],
        });
        setTimeout(() => {
          this.getData();
        });
      });
    }
    if (currentId && nextId === undefined) {
      //渲染自己的数据
      setTimeout(() => {
        this.setState({
          id: null,
          userData: null,
          playList: [],
          subAlbum: [],
          subscribeSinger: [],
        });
        setTimeout(() => {
          this.getData();
        });
      });
    }
    return true;
  }

  render() {
    const {
      userData,
      playList,
      subAlbum,
      subscribeSinger,
      tab,
      id,
      followed,
      userFollow,
    } = this.state;
    console.log(userData);
    if (userData === null) return renderSpin();
    return (
      <div className={"user-inf-wrapper"}>
        <div className={"profile-wrapper"}>
          <div
            className={"profile-bg"}
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
          {id === null ? (
            ""
          ) : (
            <div
              className={classnames({ sub: true, active: followed })}
              onClick={this.clickSub.bind(this, userData.profile.userId)}
            >
              {followed ? "取消关注" : "关注"}
            </div>
          )}
          <div className="number-wrapper">
            <div className="follows">关注:{userData.profile.follows}</div>
            <div className="followed">粉丝:{userData.profile.followeds}</div>
          </div>
          <div className="signature">{userData.profile.signature}</div>
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
          {id === null ? (
            <>
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
              <div
                className={classnames({ "nav-item": true, active: tab === 3 })}
                onClick={() => {
                  this.setState({ tab: 3 });
                }}
              >
                <span className={"text"}>用户</span>
                <span className={"count"}>{userFollow.length}</span>
              </div>
            </>
          ) : (
            ""
          )}
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
                      if (!this.props.user || !this.props.user.code) {
                        message.warn("登陆后可查看");
                        return;
                      }
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
        {tab === 1 && id === null && (
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
        {tab === 2 && id === null && (
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
        {tab === 3 && id === null && (
          <div className="follow-wrapper">
            <item className="item-wrapper">
              {userFollow.map((item) => {
                return (
                  <div
                    className="item"
                    key={getOnlyHash()}
                    onClick={() => {
                      this.setState({
                        id: item.userId,
                        userData: null,
                        playList: [],
                        subAlbum: [],
                        subscribeSinger: [],
                        tab: 0,
                        followed: false,
                        userFollow: [],
                      });
                      setTimeout(() => {
                        this.getData();
                      });
                    }}
                  >
                    <div className="img-wrapper">
                      <img src={item.avatarUrl} alt={item.nickname} />
                    </div>
                    <div className="name">{item.nickname}</div>
                    <div className="signature" title={item.signature}>
                      {item.signature}
                    </div>
                  </div>
                );
              })}
            </item>
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
    const { id } = this.state;
    if (id === null) {
      const { user } = this.props;
      const userId = user.account.id;
      const p = Promise.all([
        getUserInf(userId, this.source.token),
        getPlayList(userId, this.source.token),
        getSubAlbum(this.source.token),
        getSubscribeSinger(this.source.token),
        userFollow(userId, 50, this.source.token),
      ]);
      p.then((array) => {
        this.setState({
          userData: array[0],
          playList: array[1].playlist,
          subAlbum: array[2].data,
          subscribeSinger: array[3].data,
          userFollow: array[4].follow,
        });
      }).catch((e) => {
        message.error("出错啦 请刷新页面再试一次");
      });
    } else {
      const p = Promise.all([
        getUserInf(id, this.source.token),
        getPlayList(id, this.source.token),
      ]);
      p.then((array) => {
        this.setState({
          userData: array[0],
          playList: array[1].playlist,
          followed: array[0].profile.followed,
        });
      }).catch((e) => {
        message.error("出错啦 请刷新页面再试一次");
      });
    }
  }

  clickSub(id) {
    const { followed } = this.state;
    let t = 1;
    if (followed === true) t = 2;
    subUser(id, t, this.source.token).then((data) => {
      if (data && data.code === 200) {
        message.success("操作成功 数据存在延迟");
        this.setState({ followed: !followed });
      }
    });
  }
}

const mapState = (state) => ({
  user: state.getIn(["app", "user"]),
});

export default connect(mapState, null)(UserInf);
