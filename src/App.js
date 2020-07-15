import React, {lazy, Suspense} from "react";
import Header from "./components/header";
import SliderBar from "./components/sliderBar";
import Search from './components/search';
import {
    Route,
    Switch,
    Redirect,
} from "react-router-dom";
import "./App.scss";
import NProgress from 'react-nprogress' ;// 引入nprogress插件
import 'react-nprogress/nprogress.css';
import {connect} from 'react-redux';

import {Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import {CSSTransition} from 'react-transition-group'
import './assets/sass/transition.scss';

const antIcon = <LoadingOutlined style={{fontSize: 48, color: 'red'}} spin/>;

const Recommend = lazy(() => import("./pages/recommend"));

function App(props) {
    if (!props.loading) {
        NProgress.start();
    } else {
        NProgress.done();
    }
    return (
        <div className="App">
            <Header/>
            <div className={"middle-wrapper"}>
                <div className={"slider-bar-wrapper"}>
                    <SliderBar/>
                </div>
                <div className={"content-wrapper"}>
                    <Switch>
                        <Suspense
                            fallback={<div className={'loading-wrapper'}><Spin tip={'loading'} indicator={antIcon}/>
                            </div>}>
                            <Route path='/recommend' exact component={Recommend}/>
                            <Redirect to="/recommend"/>
                        </Suspense>
                    </Switch>
                </div>
                {
                    <CSSTransition in={props.searchStatus} timeout={400} classNames={'rightIn'}
                                   unmountOnExit appear={true}>
                        <div className={'search-wrapper'} >
                            <Search/>
                        </div>
                    </CSSTransition>

                }
            </div>

        </div>
    );
}

const mapState = (state) => ({
    loading: state.getIn(['app', 'loading']),
    searchStatus: state.getIn(['app', 'searchStatus'])
});


export default connect(mapState, null)(App);
