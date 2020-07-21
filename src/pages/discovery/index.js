import React, { lazy, Suspense } from "react";
import "./_style.scss";
import { changeLoading } from "../../store/actionCreator";
import { connect } from "react-redux";
import {
  getOfficialColumn,
  getNewSong,
  getRecommendMv,
} from "../../api/recommend";
import { createSong } from "../../assets/js/song";
import { createMv } from "../../assets/js/mv";
import axios from "axios";
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
    };
  }

  componentDidMount() {
    this.props.changeLoadingDone(true);
    const CancelToken = axios.CancelToken;
    this.source = CancelToken.source();
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
    return (
      <React.Fragment>
        <Suspense fallback={<React.Fragment />}>
          <div>
            <Banner/>
            <div className={"recommend-title"}>推荐歌单</div>
            <PlayList playListData={this.state.playListData} />
            <div className={"recommend-title"}>最新音乐</div>
            <NewSongList newSongList={this.state.newSongListData} />
            <div className={"recommend-title"}>推荐mv</div>
            <MvList mvData={this.state.mvData} />
          </div>
        </Suspense>
      </React.Fragment>
    );
  }

  componentWillUnmount() {
    this.source.cancel && this.source.cancel("cancel");
    this.setState = ()=>false;
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
