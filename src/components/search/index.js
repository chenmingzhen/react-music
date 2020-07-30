import React from "react";
import "./_style.scss";
import { setSearchControl } from "../../store/actionCreator";
import { connect } from "react-redux";
import { getHotSearch, getSearchSuggestion } from "../../api/search";
import PubSub from "pubsub-js";
import { filterSinger } from "../../assets/js/song";
import { withRouter } from "react-router-dom";
import { removeLocalStorage } from "../../util/localStorage";

class Search extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      hotSearch: [],
      searchSuggestion: {},
      search: "",
      historySearch: [],
    };
    this.timer = null;
  }

  componentDidMount() {
    this.token = PubSub.subscribe("send-search-value", (eventName, data) => {
      //查找搜索建议
      this.setState({ search: data });
      if (data !== "")
        this.throttle(this.handleSearchSuggestion.bind(this, data), 500)();
    });
    this.enter = PubSub.subscribe("send-enter", (eventName, data) => {
      this.setState({ historySearch: data });
    });
    getHotSearch().then((data) => {
      this.setState({ hotSearch: data.result.hots });
    });
  }

  render() {
    const { search } = this.state;
    return (
      <div className={"search-wrapper"}>
        {search === "" ? this.renderInitialPage() : this.renderSuggestion()}
      </div>
    );
  }

  renderInitialPage() {
    const { hotSearch, historySearch } = this.state;
    return (
      <>
        <div className="hot-search-wrapper">
          <div className="title">热门搜索</div>
          <div className="item-wrapper">
            {hotSearch.map((item, index) => {
              return (
                <span className={"item"} key={index}>
                  {item.first}
                </span>
              );
            })}
          </div>
        </div>
        <div className="hot-search-wrapper">
          <div className="top">
            <div className="title">历史搜索</div>
            {historySearch.length > 0 ? (
              <i
                className={"iconfont icon-lajitong"}
                onClick={() => {
                  removeLocalStorage("_search_history");
                  this.setState({ historySearch: [] });
                }}
              />
            ) : (
              ""
            )}
          </div>
          <div className="item-wrapper">
            {historySearch.map((item, index) => {
              return (
                <span className={"item"} key={index}>
                  {item.first}
                </span>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  renderSuggestion() {
    return (
      <div className={"suggestion-wrapper"}>
        {this.renderArtists()}
        {this.renderAlbum()}
        {this.renderSong()}
      </div>
    );
  }

  renderArtists() {
    const { searchSuggestion } = this.state;
    if (!searchSuggestion.artists) return;
    return (
      <div className={"artists-wrapper"}>
        <div className="title-wrapper">
          <i className={"iconfont icon-geren5"} />
          <div className="title">歌手</div>
        </div>
        {searchSuggestion.artists.map((item, index) => {
          return (
            <div
              className={"artist-item"}
              key={index}
              onClick={() => {
                this.props.setSearchControl(false);
                this.props.history.push({
                  pathname: "/singer/singerdetail/" + item.id,
                });
              }}
            >
              {item.name}
            </div>
          );
        })}
      </div>
    );
  }

  renderAlbum() {
    const { searchSuggestion } = this.state;
    if (!searchSuggestion.albums) return;
    return (
      <div className={"album-wrapper"}>
        <div className="title-wrapper">
          <i className={"iconfont icon-liebiao"} />
          <div className="title">专辑</div>
        </div>
        {searchSuggestion.albums.map((item, index) => {
          return (
            <div
              className={"album-item"}
              key={index}
              onClick={() => {
                this.props.setSearchControl(false);
                this.props.history.push({
                  pathname: "/albumdetail/" + item.id,
                });
              }}
            >
              <div className="name">{item.name}</div>
              <div className="singer-name">{item.artist.name}</div>
            </div>
          );
        })}
      </div>
    );
  }

  renderSong() {
    const { searchSuggestion } = this.state;
    if (!searchSuggestion.songs) return;
    return (
      <div className={"song-wrapper"}>
        <div className="title-wrapper">
          <i className={"iconfont icon-yinle"} />
          <div className="title">歌曲</div>
        </div>
        {searchSuggestion.songs.map((item, index) => {
          return (
            <div className={"song-item"} key={index}>
              <div className="name">{item.name}</div>
              <div className="singer-name">{filterSinger(item.artists)}</div>
            </div>
          );
        })}
      </div>
    );
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
    PubSub.unsubscribe(this.enter);
  }

  handleSearchSuggestion(data) {
    getSearchSuggestion(data).then((suggestion) => {
      if (suggestion) this.setState({ searchSuggestion: suggestion.result });
    });
  }

  //节流函数
  throttle(fn, wait) {
    return () => {
      //var context = this;
      let args = arguments;
      if (!this.timer) {
        this.timer = setTimeout(() => {
          fn.apply(this, args);
          this.timer = null;
        }, wait);
      }
    };
  }
}

const mapState = (state) => ({
  searchControl: state.getIn(["app", "searchControl"]),
});

const mapDispatch = (dispatch) => ({
  setSearchControl(result) {
    dispatch(setSearchControl(result));
  },
});

export default withRouter(connect(mapState, mapDispatch)(Search));
