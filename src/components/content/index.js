import React from "react";
import { getBanner } from "../../api/recommend";
import { Carousel } from "antd";
import "./_style.scss";
import { Spin } from "antd";
export default class Content extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bannerData: {},
    };
  }

  componentDidMount() {
    getBanner().then((data) => {
      this.setState(() => ({ bannerData: data.banners }));
    });
  }

  render() {
    if (this.state.bannerData.length > 0) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="banner-wrapper">
            <Carousel autoplay>
              {this.state.bannerData.map((item, index) => {
                return (
                  <div key={index}>
                    <img src={item.imageUrl} alt=""  loading="lazy"/>
                  </div>
                );
              })}
            </Carousel>
          </div>
        </div>
      );
    }
    return (
      <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <Spin></Spin>
      </div>
    );
  }
}
