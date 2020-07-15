import {getNewSong} from "../../api/recommend";
import React from "react";
import {AddZero} from "../../assets/js/util";
import LazyLoad from '../lazyLoad/index'
import {createSong} from "../../assets/js/song";
import './_style.scss'
class NewSongList extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            listData: []
        }
    }

    componentDidMount() {
        getNewSong().then(data => {
            data.result.forEach((item, index) => {
                createSong(item.song).then(data => {
                    const listData = [...this.state.listData];
                    listData.push(data);
                    this.setState({listData});
                })
            })
        })
    }

    render() {
        return (
            <div className={'new-song-list-wrapper'}>
                {
                    this.state.listData.length && this.state.listData.map((item, index) => {
                        return (
                            <div className={'new-song-list-item-wrapper'} key={index}>
                                <div className="rank">{AddZero(index)}</div>
                                <div className={'img-wrapper'}>
                                    <LazyLoad src={item.image} alt=""/>
                                    <i className={'iconfont icon-bofang'}/>
                                </div>
                                <div className="text-wrapper">
                                    <p className="name">{item.name}</p>
                                    <p className="singer">{item.singer}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default NewSongList;
