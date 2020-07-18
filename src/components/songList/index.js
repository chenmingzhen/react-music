import React from "react";
import {createSong} from "../../assets/js/song";
import {formatDuration} from "../../util/util";
import './_style.scss'
import {Spin,} from "antd";

class SongList extends React.Component {


    constructor(props) {
        super(props);
        this.state = {song: []}
    }


    componentDidMount() {
        this.props.songList.forEach(item => {
            createSong(item).then(data => {
                let tmp = [...this.state.song]
                tmp.push(data);
                this.setState({song: tmp});
            });
        })

    }

    render() {
        let {song} = this.state;
        if (song.length > 0) {
            return (
                <div className={"song-list-wrapper"}>
                    <div className="fix-wrapper">
                        <div className="title">音乐标题</div>
                        <div className="singer">歌手</div>
                        <div className="album">专辑</div>
                        <div className="time">时长</div>
                    </div>
                    <div className="list-wrapper">
                        {
                            song.map((item, index) => {
                                return (
                                    <div className="list-item" key={index}
                                         style={index % 2 === 0 ? {'background': '#fafafa'} : {}}>
                                        <div className={"number"}>
                                            {
                                                index + 1 < 10 ? ('0' + (index + 1)) : index + 1
                                            }
                                        </div>
                                        <div className="title">
                                            {item.name}
                                            {
                                                item.fee === 1 ? (<i className="iconfont icon-VIP"></i>) : ''
                                            }
                                        </div>
                                        <div className="singer">{item.singer}</div>
                                        <div className="album">{item.album.name}</div>
                                        <div className="duration">{formatDuration(item.duration)}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>)
        } else {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%'
                }}><Spin/></div>
            )
        }
    }
}

export default SongList;