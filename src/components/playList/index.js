import React from "react";
import {getOfficialColumn} from "../../api/recommend";
import './_style.scss'

export default class PlayList extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            playListData: []
        }
    }

    componentDidMount() {
        getOfficialColumn(10).then(data => {
            this.setState({playListData: data.result});
        })
    }


    render() {
        return (
            <div className={'playlist-wrapper'}>
                {
                    this.state.playListData.length && this.state.playListData.map((item, index) => {
                        return (
                            <div className={'playlist-item'} key={index}>
                                <div className="img-wrap">
                                    <img src={item.picUrl} alt="none"/>
                                    <div className="desc-wrapper">
                                        {item.copywriter}
                                    </div>
                                    <div className="play-icon-wrapper">
                                        <i className={'iconfont icon-bofang'}/>
                                    </div>
                                </div>
                                <p className={'text'}>{item.name}</p>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}
