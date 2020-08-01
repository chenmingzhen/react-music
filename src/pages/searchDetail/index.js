import React from "react";
import { getSearchResult } from "../../api/search";
import "./_style.scss";
import classNames from "classnames";
import SongList from "../../components/songList";
import { connect } from "react-redux";
import { Pagination } from "antd";
import { setSearchOffset, setSearchType } from "./store/actionCreator";
import PlayList from "../../components/playList";
import SearchAlbumList from "../../components/albumList/searchAlbumList";
import SingerList from "../../components/singerList";
class SearchDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: "",
      type: 1,
      offset: 0,
      singerResult: {},
      songResult: {},
      alumResult: {},
      playListResult: {},
    };
    this.navItem = [
      { name: "歌曲", type: 1 },
      { name: "专辑", type: 10 },
      { name: "歌手", type: 100 },
      { name: "歌单", type: 1000 },
    ];
  }

  componentDidMount() {}

  render() {
    const { keyword } = this.props.match.params;
    const { searchKeyword } = this.state;
    if (keyword !== searchKeyword) {
      //读取数据
      if (searchKeyword !== "") {
        setTimeout(() => {
          this.getSearchData(true);
        });
      } else {
        setTimeout(() => {
          this.getSearchData();
        });
      }
    }
    return (
      <div className={"search-result-wrapper"}>
        {this.renderTop()}
        {this.renderNav()}
        {this.renderContent()}
        {this.renderPagination()}
      </div>
    );
  }

  renderTop() {
    const { searchKeyword } = this.state;
    return (
      <div className="top-wrapper">
        <span className="title">{searchKeyword}</span>
        <span className="count">找到{this.typeIs()}条</span>
      </div>
    );
  }

  renderNav() {
    return (
      <div className="nav-wrapper">
        {this.navItem.map((item, index) => {
          return (
            <div
              className={classNames({
                "nav-item": true,
                active: item.type === this.props.type,
              })}
              key={index}
              onClick={() => {
                this.props.setType(item.type);
                this.props.setOffset(0);
                setTimeout(() => {
                  this.getSearchData();
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

  renderContent() {
    const { type } = this.props;
    switch (type) {
      case 1:
        return this.renderSong();
      case 10:
        return this.renderAlbumList();
      case 100:
        return this.renderSingerList();
      case 1000:
        return this.renderPlayList();
      default:
        return this.renderSong();
    }
  }

  renderSong() {
    const { songResult } = this.state;
    return (
      <div className={"song-wrapper"}>
        {songResult.songs && songResult.songs.length > 0 ? (
          <SongList songList={songResult.songs} style={{ padding: "1.5rem" }} />
        ) : (
          ""
        )}
      </div>
    );
  }

  renderPlayList() {
    const { playListResult } = this.state;
    return (
      <div>
        {playListResult.playlists && playListResult.playlists.length > 0 ? (
          <PlayList playListData={playListResult.playlists} />
        ) : (
          ""
        )}
      </div>
    );
  }

  renderAlbumList() {
    const { alumResult } = this.state;
    return (
      <div>
        {alumResult.albums && alumResult.albums.length > 0 ? (
          <SearchAlbumList
            albumListData={alumResult.albums}
            style={{ padding: "1rem 10rem" }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }

  renderSingerList() {
    const { singerResult } = this.state;
    return (
      <div>
        {singerResult.artists && singerResult.artists.length > 0 ? (
          <SingerList singerListData={singerResult.artists} />
        ) : (
          ""
        )}
      </div>
    );
  }

  renderPagination() {
    const { singerResult, songResult, alumResult, playListResult } = this.state;
    if (
      singerResult.artistCount ||
      songResult.songCount ||
      alumResult.albumCount ||
      playListResult.playlistCount
    ) {
      return (
        <Pagination
          defaultCurrent={this.props.offset + 1}
          pageSize={20}
          total={
            singerResult.artistCount |
            songResult.songCount |
            alumResult.albumCount |
            playListResult.playlistCount
          }
          onChange={(page) => {
            this.props.setOffset(page - 1);
            setTimeout(() => {
              this.getSearchData();
            });
          }}
          showSizeChanger={false}
        />
      );
    } else {
      return "加载中....";
    }
  }

  componentWillUnmount() {
    this.setState = () => false;
  }

  typeIs() {
    const { singerResult, songResult, alumResult, playListResult } = this.state;
    const { type } = this.props;
    switch (type) {
      case 1:
        return songResult.songCount;
      case 10:
        return alumResult.albumCount;
      case 100:
        return singerResult.artistCount;
      case 1000:
        return playListResult.playlistCount;
      default:
        return 0;
    }
  }

  setTypeData(result) {
    const { type } = this.props;
    switch (type) {
      case 1:
        this.setState({ songResult: result });
        break;
      case 10:
        this.setState({ alumResult: result });
        break;
      case 100:
        this.setState({ singerResult: result });
        break;
      case 1000:
        this.setState({ playListResult: result });
        break;
      default:
        break;
    }
  }

  getSearchData(reset) {
    const { keyword } = this.props.match.params;
    const { type, offset } = this.props;
    this.setState({
      singerResult: {},
      songResult: {},
      alumResult: {},
      playListResult: {},
    });
    if (reset) {
      this.props.setOffset(0);
    }
    setTimeout(() => {
      getSearchResult(keyword, type, 20, offset * 20).then((data) => {
        if (data && data.result) {
          this.setState({ searchKeyword: keyword });
          this.setTypeData(data.result);
        }
      });
    });
  }
}

const mapState = (state) => ({
  type: state.getIn(["search", "type"]),
  offset: state.getIn(["search", "offset"]),
});

const mapDispatch = (dispatch) => ({
  setOffset(offset) {
    dispatch(setSearchOffset(offset));
  },
  setType(type) {
    dispatch(setSearchType(type));
  },
});

export default connect(mapState, mapDispatch)(SearchDetail);
