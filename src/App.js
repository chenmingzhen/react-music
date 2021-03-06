import React, { lazy, Suspense, useState } from "react";
import Header from "./components/header";
import SliderBar from "./components/sliderBar";
import Search from "./components/search";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import NProgress from "react-nprogress"; // 引入nprogress插件
import "react-nprogress/nprogress.css";
import { connect } from "react-redux";
import PubSub from "pubsub-js";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { CSSTransition } from "react-transition-group";
import "./assets/sass/transition.scss";
import Player from "./components/player";
import classnames from "classnames";

const antIcon = <LoadingOutlined style={{ fontSize: 64, color: "red" }} spin />;

const Discovery = lazy(() => import("./pages/discovery"));
const PlayList = lazy(() => import("./pages/playList"));
const DailyRecommend = lazy(() => import("./pages/dailyRecommend"));
const SongSheet = lazy(() => import("./pages/songSheet"));
const Chart = lazy(() => import("./pages/chart"));
const Singer = lazy(() => import("./pages/singer"));
const SingerDetail = lazy(() => import("./pages/singerDetail"));
const AlbumDetail = lazy(() => import("./pages/albumDetail"));
const MvPlay = lazy(() => import("./pages/mvPlay"));
const SearchDetail = lazy(() => import("./pages/searchDetail"));
const Shared = lazy(() => import("./pages/shared"));
const UserInf = lazy(() => import("./pages/userInf"));

function App(props) {
  if (!props.loading) {
    NProgress.start();
  } else {
    NProgress.done();
  }

  const [packUp, setPackUp] = useState(false);
  function clickPackUp() {
    setPackUp(!packUp);
  }

  return (
    <div className="App">
      <Header />
      <div className={"middle-wrapper"}>
        <>
          <div
            className={classnames({
              "slider-bar-wrapper": true,
              hide: packUp,
            })}
          >
            <div className={"back-up-wrapper"} onClick={clickPackUp}>
              <span
                className={classnames({
                  "back-up iconfont icon-ico_leftarrow": true,
                  "turn-right": packUp,
                })}
                title={!packUp ? "收起" : "展开"}
              />
            </div>
            <SliderBar />
          </div>
          <div
            className={classnames({
              "content-wrapper": true,
              show: packUp,
            })}
            id="content-wrapper"
            onScroll={(e) => {
              if (e.target.scrollTop > 300) {
                PubSub.publish("shadow", true);
              } else {
                PubSub.publish("shadow", false);
              }
            }}
          >
            <Suspense
              fallback={
                <div className={"loading-wrapper"}>
                  <Spin tip={"加载中"} indicator={antIcon} />
                </div>
              }
            >
              <Switch>
                <Route path="/discovery" exact component={Discovery} />
                {props.user && props.user.code ? (
                  <Route path="/playlist/:id" exact component={PlayList} />
                ) : (
                  ""
                )}
                <Route path="/commentplaylist/:id" exact component={PlayList} />
                <Route
                  path="/dailyrecommend"
                  exact
                  component={DailyRecommend}
                />
                <Route path="/songsheet" exact component={SongSheet} />
                <Route path="/chart" exact component={Chart} />
                <Route path="/singer" exact component={Singer} />
                {/*非二级路由*/}
                <Route
                  path={"/singer/singerdetail/:id"}
                  exact
                  component={SingerDetail}
                />
                <Route
                  path={"/albumdetail/:id"}
                  exact
                  component={AlbumDetail}
                />
                <Route path="/mvplay/:id" exact component={MvPlay} />
                <Route
                  path="/searchdetail/:keyword"
                  exact
                  component={SearchDetail}
                />
                <Route path="/shared" component={Shared} />
                <Route path="/userInf" component={UserInf} />
                <Redirect to="/discovery" />
              </Switch>
            </Suspense>
          </div>
        </>
        {
          <CSSTransition
            in={props.searchControl}
            timeout={400}
            classNames={"rightIn"}
            unmountOnExit
            appear={true}
          >
            <div className={"search-wrapper"}>
              <Search />
            </div>
          </CSSTransition>
        }
      </div>
      <Player />
    </div>
  );
}

const mapState = (state) => ({
  loading: state.getIn(["app", "loading"]),
  searchStatus: state.getIn(["app", "searchStatus"]),
  user: state.getIn(["app", "user"]),
  middleAll: state.getIn(["app", "middleAll"]),
  searchControl: state.getIn(["app", "searchControl"]),
});

const mapDispatch = (dispatch) => ({
  /*setSearchControl(result) {
    dispatch(setSearchControl(result));
  },*/
});

export default connect(mapState, mapDispatch)(App);
