import React, {lazy, Suspense} from "react";
import './_style.scss'
import {changeLoading} from "../../store/actionCreator";
import {connect} from 'react-redux';

const Banner = lazy(() => import("../../components/content"));
const PlayList = lazy(() => import('../../components/playList'));
const NewSongList = lazy(() => import('../../components/newSongList'));
const MvList = lazy(() => import('../../components/mvList'));

class Recommend extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.props.changeLoadingDone(true);
    }

    render() {
        return <React.Fragment>
            <Suspense fallback={<React.Fragment/>}>
                <div>
                    <Banner/>
                    <div className={'recommend-title'}>推荐歌单</div>
                    <PlayList/>
                    <div className={'recommend-title'}>最新音乐</div>
                    <NewSongList/>
                    <div className={'recommend-title'}>推荐mv</div>
                    <MvList/>
                </div>
            </Suspense>
        </React.Fragment>;
    }
}

const mapState = (state) => ({
    loading: state.getIn(['app', 'loading'])
});

const mapDispatch = (dispatch) => ({
    changeLoadingDone(result) {
        dispatch(changeLoading(result))
    }
});

export default connect(mapState, mapDispatch)(Recommend);
