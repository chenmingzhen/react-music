import React, { lazy } from "react";
import "./_style.scss";
import { changeLoading } from "../../store/actionCreator";
import { connect } from "react-redux";
import {
  getNewSong,
  getOfficialColumn,
  getRecommendMv,
} from "../../api/recommend";
import { createSong } from "../../assets/js/song";
import { createMv } from "../../assets/js/mv";
import axios from "axios";
import { renderSpin } from "../../util/renderSpin";
import { getBanner } from "../../api/recommend";

//import Banner from "../../components/content/banner";
const Banner = lazy(() => import("../../components/content"));
const PlayList = lazy(() => import("../../components/playList"));
const NewSongList = lazy(() => import("../../components/newSongList"));
const MvList = lazy(() => import("../../components/mvList"));

class Recommend extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      playListData: [],
      newSongListData: [],
      mvData: [],
      bannerData: [],
    };
  }

  componentDidMount() {
    this.props.changeLoadingDone(true);
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();

    getBanner(this.source.token, this.source.token).then((data) => {
      if (data) {
        this.setState(() => ({ bannerData: data.banners }));
      }
    });

    getOfficialColumn(10, this.source.token)
      .then((data) => {
        this.setState({ playListData: data.result });
      })
      .catch((e) => {});

    getNewSong(this.source.token)
      .then((data) => {
        data.result.forEach((item, index) => {
          createSong(item.song).then((data) => {
            const newSongListData = [...this.state.newSongListData];
            newSongListData.push(data);
            this.setState({ newSongListData });
          });
        });
      })
      .catch((e) => {});

    getRecommendMv(this.source.token)
      .then((data) => {
        data.result.forEach((item, index) => {
          const mvData = [...this.state.mvData];
          mvData.push(createMv(item));
          this.setState(() => ({ mvData }));
        });
      })
      .catch((e) => {});
  }

  render() {
    const { playListData, newSongListData, mvData, bannerData } = this.state;
    return (
      <React.Fragment>
        {playListData.length > 0 &&
        newSongListData.length > 0 &&
        mvData.length > 0 &&
        bannerData.length > 0 ? (
          <div>
            <Banner bannerData={bannerData} />
            <div className={"recommend-title"}>推荐歌单</div>
            <PlayList playListData={this.state.playListData} />
            <div className={"recommend-title"}>最新音乐</div>
            {this.state.newSongListData.length === 10 && (
              <NewSongList newSongList={this.state.newSongListData} />
            )}
            <div className={"recommend-title"}>推荐mv</div>
            <MvList mvData={this.state.mvData} />
          </div>
        ) : (
          renderSpin()
        )}
      </React.Fragment>
    );
  }

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("cancel");
    this.setState = () => false;
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

export default connect(mapState, mapDispatch)(Recommend);
