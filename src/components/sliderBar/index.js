import React, {useState} from "react";
import './_style.scss';

let InfData = [{
    'title': '',
    'content': [{'icon': 'iconfont icon-yinle', 'subTitle': '发现音乐'}, {
        'icon': 'iconfont icon-ai-video',
        'subTitle': '视频'
    }]
},
    {
        'title': '我的音乐',
        'content': [{'icon': 'iconfont icon-collection-b', 'subTitle': '我的收藏'}]
    }];
const SliderBar= () => {
    let [data, setData] = useState(InfData);
    return (
        <>
            <div className="selfInf">
                <div className="avatar"><img src={'img/github-logo.png'} alt=""/></div>
                <div className="name">陈一鑫</div>
            </div>
            <div className="list-scroll">
                {data.map((item, index) => {
                    return (
                        <div className="item-wrapper" key={index}>
                            {
                                item.title ? (
                                    <div className={'title'}>{item.title}</div>
                                ) : ''
                            }
                            {
                                item.content.map((_item, _index) => {
                                    return (
                                        <div className={'subtitle-wrapper'} key={_index}>
                                            {
                                                _item.icon ? (
                                                    <i className={_item.icon}/>
                                                ) : ''
                                            }
                                            <div className={'subtitle'}>{_item.subTitle}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })}
            </div>
        </>
    )
};
export default SliderBar;
