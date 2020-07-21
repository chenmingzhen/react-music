import React from "react";
import { getCatList } from "../../api/songSheet";
import { getPlayList } from "../../api/songSheet";
import { Spin, Popover, Pagination } from "antd";
import PlayList from "../../components/playList";
import { connect } from "react-redux";
import { changeLoading } from "../../store/actionCreator";
import "./_style.scss";
class SongSheet extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      catList: {
        all: [],
        language: [],
        style: [],
        scene: [],
        emotion: [],
        theme: [],
      },
      showList: [],
      currentName: "全部",
      offset: 0,
      total: 0,
    };
  }
  componentDidMount() {
    this.props.changeLoadingDone(true);
    //歌单分类
    getCatList().then((data) => {
      this.classifyList(data.sub);
    });
    getPlayList().then((data) => {
      this.setState({ showList: data.playlists, total: data.total });
    });
  }
  render() {
    const { showList, currentName } = this.state;
    return (
      <div className={"song-sheet-wrapper"}>
        {this.renderBanner()}
        {
          <div className={"select-wrapper"}>
            <Popover
              placement="bottom"
              content={<div>{this.renderSetectItem()}</div>}
              trigger="click"
            >
              <div className="left-button">
                {currentName === "loading" ? this.renderSpin() : currentName}
              </div>
            </Popover>
          </div>
        }
        {showList.length > 0 ? (
          <PlayList playListData={showList}></PlayList>
        ) : (
          this.renderSpin()
        )}
        {this.renderPagination()}
      </div>
    );
  }

  renderBanner() {
    const { showList, currentName } = this.state;
    const randomList = this.getRandomList();
    return (
      <div className={"banner-wrapper"}>
        {showList.length > 0 ? (
          <>
            <div
              className={"bg-wrpper"}
              style={{ background: `url(${randomList.coverImgUrl})` }}
            ></div>
            <div className={"bg-mask"}></div>
            <div className={"top-wrapper"}>
              <div className={"img-wrapper"}>
                <img src={randomList.coverImgUrl} alt="" loading="lazy" />
              </div>
              <div className={"text-wrapper"}>
                <div className={"tag"}>精品歌单</div>
                {showList.length > 0 ? (
                  <>
                    <div className={"title"}>{randomList.name}</div>
                    <div className={"desc"}>{randomList.description}</div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </>
        ) : (
          this.renderSpin()
        )}
      </div>
    );
  }

  renderPagination() {
    const { showList, offset, total, currentName } = this.state;
    if (showList.length > 0) {
      return (
        <Pagination
          defaultCurrent={offset + 1}
          pageSize={50}
          showSizeChanger={false}
          total={total}
          onChange={(page) => {
            this.setState({ offset: page - 1, showList: [] });
            getPlayList(currentName, (page - 1) * 50).then((data) => {
              this.setState({ showList: data.playlists });
            });
          }}
        ></Pagination>
      );
    }
    return "";
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

  renderSetectItem() {
    const { catList } = this.state;
    if (catList.language.length === 0) {
      return this.renderSpin();
    }
    let tmp = (
      <>
        {Object.getOwnPropertyNames(catList).map((item, index) => {
          return (
            <div
              className={"select-vertical-wrapper"}
              key={"select-vertical-wrapper" + index}
            >
              <div className={"select-vertical-title"}>{translate(item)}</div>
              <div
                className={"select-vertical-item"}
                key={"select-vertical-item" + index}
              >
                {catList[item].map((_item, _index) => {
                  return (
                    <div
                      className={
                        _item.name === this.state.currentName
                          ? "select-item active"
                          : "select-item"
                      }
                      key={"select-item" + _index}
                      onClick={this.clickItem.bind(this, _item.name)}
                    >
                      {_item.name}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </>
    );
    return <div className={"select-content"}>{tmp}</div>;
  }

  classifyList(sub) {
    let language = [],
      style = [],
      scene = [],
      emotion = [],
      theme = [],
      all = [{ name: "全部" }];
    sub.forEach((item) => {
      switch (item.category) {
        case 0:
          language.push(item);
          break;
        case 1:
          style.push(item);
          break;
        case 2:
          scene.push(item);
          break;
        case 3:
          emotion.push(item);
          break;
        case 4:
          theme.push(item);
          break;
        default:
          break;
      }
    });
    this.setState({ catList: { all, language, style, scene, emotion, theme } });
  }

  getRandomList() {
    return this.state.showList[Math.floor(Math.random() * 50 + 1)];
  }

  clickItem(name) {
    this.setState({ showList: [], currentName: "loading", offset: 0 });
    getPlayList(name).then((data) => {
      this.setState({ showList: data.playlists, currentName: name });
    });
  }
}

function translate(str) {
  switch (str) {
    case "language":
      return "语种";
    case "style":
      return "风格";
    case "scene":
      return "场景";
    case "emotion":
      return "情感";
    case "theme":
      return "主题";
    case "all":
      return "全部";
    default:
      return "";
  }
}

const mapState = (state) => ({
  loading: state.getIn(["app", "loading"]),
});

const mapDispatch = (dispatch) => ({
  changeLoadingDone(result) {
    dispatch(changeLoading(result));
  },
});
export default connect(mapState, mapDispatch)(SongSheet);
