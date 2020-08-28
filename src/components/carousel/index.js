import React from "react";
import { getFavouriteSinger } from "../../api/singer";
import "./_style.scss";
import { withRouter } from "react-router-dom";
import { transHttp } from "../../util/util";

class Carousel extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      singerList: [],
    };
  }

  componentDidMount() {
    getFavouriteSinger().then((data) => {
      if (data.data) {
        let tmp = [];
        this.getRandom(data, 9).forEach((item) => {
          tmp.push(data.data[item]);
        });
        this.setState({ singerList: tmp });
      }
    });
  }

  render() {
    return (
      <div className="container">
        <div id="carousel">{this.renderItem()}</div>
      </div>
    );
  }

  renderItem() {
    let { singerList } = this.state;
    let count = singerList.length > 9 ? 9 : singerList.length;
    if (count === 0) return;
    return (
      <>
        {singerList.map((item, index) => {
          if (index > count) return "";
          return (
            <div
              style={{
                transform: `rotateY(${
                  40 * (index + 1) - 360 / count
                }deg) translateZ(288px)`,
              }}
              key={index}
              onClick={() => {
                this.props.history.push({
                  pathname: "/singer/singerdetail/" + item.id,
                });
              }}
            >
              <img src={transHttp(item.picUrl)} alt="" />
            </div>
          );
        })}
      </>
    );
  }

  getRandom(data, maxNum) {
    if (data.count <= 9) return data.data;
    let arr = [],
      numArr = [];
    for (let i = 0; i < data.count; i++) {
      arr.push(i);
    }
    let arrLength = arr.length;
    for (let i = 0; i < arrLength; i++) {
      let number = Math.floor(Math.random() * arr.length); //生成随机数num
      numArr.push(arr[number]);
      arr.splice(number, 1);
      if (arr.length <= arrLength - maxNum) {
        return numArr;
      }
    }
  }
}

export default withRouter(Carousel);
