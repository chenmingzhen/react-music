import React from "react";
import { getBanner } from "../../api/recommend";
import { Carousel } from "antd";
import "./_style.scss";
import axios from "axios";
import { renderSpin } from "../../util/renderSpin";
import { filterMv, filterSinger, Song } from "../../assets/js/song";
import { getSong, getSongDetail } from "../../api/singer";
import { connect } from "react-redux";
import { setCurrentIndex, setPlayList } from "../player/store/actionCreator";
import { isObjectValueEqual } from "../../assets/js/util";

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerData: {},
    };
  }

  componentDidMount() {
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
    getBanner(this.source.token).then((data) => {
      this.setState(() => ({ bannerData: data.banners }));
    });
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { bannerData } = this.state;
    if (isObjectValueEqual(bannerData, nextState.bannerData)) {
      return false;
    }
    return true;
  }

  render() {
    if (this.state.bannerData.length > 0) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="banner-wrapper">
            <Carousel autoplay>
              {this.state.bannerData.map((item, index) => {
                return (
                  <div key={index} onClick={this.handleClick.bind(this, item)}>
                    <img src={item.imageUrl} alt="" loading="lazy" />
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
      );
    }
    return renderSpin();
  }

  componentWillUnmount() {
    this.source.cancel("cancel");
    this.setState = () => false;
  }

  handleClick(item) {
    const { setPlaylist, setCurrentIndex } = this.props;
    if (item.targetId === 0) {
      window.open(item.url);
    } else {
      // getSongDetail
      (async () => {
        let _url = "";
        await getSong(item.targetId).then((data) => {
          if (data !== undefined) {
            _url = data.data[0].url;
          }
        });
        let musicData = {};
        await getSongDetail(item.targetId).then((data) => {
          musicData = data.songs[0];
        });

        const song = new Song({
          id: musicData.id,
          name: musicData.name,
          ar:
            filterSinger(musicData.ar) ||
            filterSinger(musicData.artists) ||
            musicData.singer,
          al: musicData.al || musicData.album,
          dt: musicData.dt || musicData.duration,
          image:
            (musicData.al && musicData.al.picUrl) || musicData.album.picUrl,
          url: _url,
          fee: musicData.fee,
          mvid: filterMv(musicData),
        });

        let array = [];
        array.push(song);
        setPlaylist(array);
        setCurrentIndex(0);
      })();
    }
  }
}

const mapState = (state) => {
  return {
    playlist: state.getIn(["player", "playlist"]).toJS(),
    currentIndex: state.getIn(["player", "currentIndex"]),
  };
};

const mapDispatch = (dispatch) => ({
  setPlaylist(playlist) {
    dispatch(setPlayList(playlist));
  },
  setCurrentIndex(currentIndex) {
    dispatch(setCurrentIndex(currentIndex));
  },
});

export default connect(mapState, mapDispatch)(Content);
