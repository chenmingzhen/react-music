import React from "react";
import "./_style.scss";
import Cookies from "js-cookie";
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from "../../util/localStorage";
import {
  setCurrentHeaderIndex,
  setHeaderStatus,
  setUser,
} from "../../store/actionCreator";
import { connect } from "react-redux";
import { login, logout } from "../../api/login";
import { Button, Input, message, Modal, Popover } from "antd";
import { UserOutlined } from "@ant-design/icons";
import axios from "axios";
import github from "../../assets/img/github-logo.png";
import { getPlayList } from "../../api/selfInfomation";
import { withRouter } from "react-router-dom";

let InfData = [];

class SliderBar extends React.PureComponent {
  //----------------------------------------------登陆框逻辑
  state = {
    ModalText: (
      <div>
        <Input
          placeholder="手机号"
          prefix={<UserOutlined />}
          onChange={(input) => {
            this.phone = input.target.value;
          }}
        />
        <div style={{ height: "1rem" }} />
        <Input.Password
          placeholder="密码"
          prefix="🔒"
          onChange={(input) => {
            this.password = input.target.value;
          }}
          type="password"
        />
      </div>
    ),
    visible: false,
    confirmLoading: false,
    data: InfData,
  };

  constructor(props) {
    super(props);
    //this.data = InfData;
    this.status = "未登录";
    this.phone = "";
    this.password = "";
    this.source = {};
    this.currentIndex = Number;
    this.popoverContent = () => {
      return (
        <Button
          onClick={() => {
            this.logOut();
          }}
        >
          退出登录
        </Button>
      );
    };
    //先要运行一次set 不知为何不运行无法输出user值
    this.props.setUser({});
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    if (!this.phone || !this.password) {
      message.error("账户或密码不能为空");
      return;
    }
    this.setState({
      confirmLoading: true,
    });
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    login(this.phone, this.password, this.source.token)
      .then((data) => {
        if (data !== undefined) {
          this.setState({
            visible: false,
            confirmLoading: false,
          });
          //保存到localstorage中
          setLocalStorage("user", data);
          this.status = "退出";
          this.props.setUser(data);
          message.success("登录成功");
          //更新歌单
          this.updatePlayList();
        } else {
          message.error("登陆失败 请检查手机号");
          this.setState({
            confirmLoading: false,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        message.error(e.message);
        this.setState({
          visible: true,
          confirmLoading: false,
        });
      });
  };

  //--------------------------------------------------

  handleCancel = () => {
    this.source.cancel && this.source.cancel("登录取消");
    this.setState({
      visible: false,
    });
  };

  loginCheck() {
    //如果存在cookie
    if (
      Cookies.get("MUSIC_U") &&
      Cookies.get("_csrf") &&
      Cookies.get("__remember_me")
    ) {
      //localstorage没有被清除
      let user = getLocalStorage("_session");
      if (user) {
        //直接获取信息
        //存储到redux中
        this.props.setUser(user);
        this.status = "退出";
        //更新歌单
        this.updatePlayList();
      } else {
        //localstorage被清除了 移除所有信息
        Cookies.remove("MUSIC_U");
        Cookies.remove("_csrf");
        Cookies.remove("__remember_me");
      }
    }
    //清除localstrage
    else {
      console.log("removeLocalStorage");
      removeLocalStorage("user");
    }
  }

  componentDidMount() {
    this.loginCheck();
  }

  updatePlayList() {
    getPlayList(this.props.user.account.id).then((data) => {
      let list = { title: "我的收藏", content: [] };
      data.playlist.forEach((item, index) => {
        let tmp = { icon: "iconfont icon-liebiao" };
        tmp.subTitle = item.name;
        tmp.listid = item.id;
        list.content.push(tmp);
      });
      //InfData不是该类的属性 深拷贝出来 放到state才会重新渲染
      InfData.push(list);
      this.setState({ data: InfData.concat() });
    });
  }

  logOut() {
    //退出登陆 删除所有的本地储存与信息
    logout()
      .then(() => {
        message.success("成功退出");
        this.status = "未登录";
        Cookies.remove("MUSIC_U");
        Cookies.remove("_csrf");
        Cookies.remove("__remember_me");
        removeLocalStorage("user");
        this.props.setUser({});
        //歌单删除
        InfData = [];
        this.setState({ data: InfData.concat() });
      })
      .catch((e) => {
        console.log(e);
        MessageChannel.error(e);
      });
  }

  render() {
    const { visible, confirmLoading, ModalText } = this.state;
    return (
      <>
        <div className="selfInf">
          <div className="avatar">
            {this.props.user !== undefined &&
              this.props.user.code !== undefined && (
                <img
                  src={this.props.user.profile.avatarUrl}
                  alt=""
                  loading="lazy"
                />
              )}
            {this.props.user.code === undefined && (
              <a
                href="https://github.com/chenmingzhen"
                target={"_blank"}
                rel="noopener noreferrer"
                title={"See Author Github"}
              >
                <img src={github} alt="" loading="lazy" />
              </a>
            )}
          </div>
          <div
            className="name"
            onClick={this.status === "未登录" ? this.showModal : () => {}}
          >
            {this.props.user.code ? (
              <Popover content={this.popoverContent} trigger="hover">
                {this.props.user.profile.nickname}
              </Popover>
            ) : (
              this.status
            )}
          </div>
        </div>
        <div className="list-scroll">
          {this.state.data.map((item, index) => {
            return (
              <div className="item-wrapper" key={index}>
                {item.title ? <div className={"title"}>{item.title}</div> : ""}
                {item.content.map((_item, _index) => {
                  return (
                    <div
                      className={
                        this.currentIndex === _index &&
                        this.props.headerStatus === false
                          ? "subtitle-wrapper active"
                          : "subtitle-wrapper"
                      }
                      key={_index}
                      data-id={_item.listid}
                      onClick={(e) => {
                        this.props.changeIndex(Number);
                        this.props.setHeaderStatus(false);
                        this.currentIndex = _index;
                        let id = e.currentTarget.getAttribute("data-id");
                        this.props.history.push({
                          pathname: `/playlist/` + id,
                        });
                      }}
                    >
                      {_item.icon ? <i className={_item.icon} /> : ""}
                      <div className={"subtitle"}>{_item.subTitle}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <Modal
          title="登录"
          visible={visible}
          onOk={this.handleOk}
          confirmLoading={confirmLoading}
          onCancel={this.handleCancel}
          okText={"登陆"}
          cancelText={"取消"}
        >
          <div>{ModalText}</div>
        </Modal>
      </>
    );
  }
}

const mapState = (state) => ({
  user: state.getIn(["app", "user"]),
  currentHeaderIndex: state.getIn(["app", "currentHeaderIndex"]),
  headerStatus: state.getIn(["app", "headerStatus"]),
});

const mapDispatch = (dispatch) => ({
  setUser(user) {
    dispatch(setUser(user));
  },
  changeIndex(index) {
    dispatch(setCurrentHeaderIndex(index));
  },
  setHeaderStatus(status) {
    dispatch(setHeaderStatus(status));
  },
});

export default withRouter(connect(mapState, mapDispatch)(SliderBar));
