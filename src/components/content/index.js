import React from "react";
import {getBanner} from "../../api/recommend";
import {Carousel} from 'antd';
import './_style.scss'

export default class Content extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            bannerData: {}
        };

    }


    componentDidMount() {
        getBanner().then(data => {
            this.setState(() => ({bannerData: data.banners}));
        });
    }

    render() {
        return (
            <div>
                <div className="banner-wrapper">
                    <Carousel autoplay>
                        {
                            this.state.bannerData.length&&this.state.bannerData.map((item,index)=>{
                                return(
                                    <div key={index}>
                                        <img src={item.imageUrl} alt=""/>
                                    </div>
                                )
                            })
                        }
                    </Carousel>
                </div>
            </div>
        );
    }

}
