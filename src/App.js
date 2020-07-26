import React, { lazy, Suspense } from "react";
import Header from "./components/header";
import SliderBar from "./components/sliderBar";
import Search from "./components/search";
import { Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import NProgress from "react-nprogress"; // 引入nprogress插件
import "react-nprogress/nprogress.css";
import { connect } from "react-redux";

import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { CSSTransition } from "react-transition-group";
import "./assets/sass/transition.scss";

const antIcon = <LoadingOutlined style={{ fontSize: 48, color: "red" }} spin />;

const Discovery = lazy(() => import("./pages/discovery"));
const PlayList = lazy(() => import("./pages/playList"));
const DailyRecommend = lazy(() => import("./pages/dailyRecommend"));
const SongSheet = lazy(() => import("./pages/songSheet"));
const Chart = lazy(() => import("./pages/chart"));
const Singer = lazy(() => import("./pages/singer"));
const SingerDetail = lazy(() => import("./pages/singerDetail"));

function App(props) {
  if (!props.loading) {
    NProgress.start();
  } else {
    NProgress.done();
  }
  return (
    <div className="App">
      <Header />
      <div className={"middle-wrapper"}>
        <div className={"slider-bar-wrapper"}>
          <SliderBar />
        </div>
        <div className={"content-wrapper"} id="content-wrapper">
          <Suspense
            fallback={
              <div className={"loading-wrapper"}>
                <Spin tip={"loading"} indicator={antIcon} />
              </div>
            }
          >
            <Switch>
              <Route path="/discovery" exact component={Discovery} />
              {props.user.code ? (
                <Route path="/playlist/:id" exact component={PlayList} />
              ) : (
                ""
              )}
              <Route path="/commentplaylist/:id" exact component={PlayList} />
              <Route path="/dailyrecommend" exact component={DailyRecommend} />
              <Route path="/songsheet" exact component={SongSheet} />
              <Route path="/chart" exact component={Chart} />
              <Route path="/singer" exact component={Singer} />
              {/*非二级路由*/}
              <Route
                path={"/singer/singerdetail/:id"}
                exact
                component={SingerDetail}
              />
              <Redirect to="/discovery" />
            </Switch>
          </Suspense>
        </div>
        {
          <CSSTransition
            in={props.searchStatus}
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
    </div>
  );
}

const mapState = (state) => ({
  loading: state.getIn(["app", "loading"]),
  searchStatus: state.getIn(["app", "searchStatus"]),
  user: state.getIn(["app", "user"]),
});

export default connect(mapState, null)(App);
