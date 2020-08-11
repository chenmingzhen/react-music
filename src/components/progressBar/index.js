import React from "react";
import "./_style.scss";
import PropTypes from "prop-types";
class ProgressBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.touch = {};
  }

  render() {
    this.setProgressOffset(this.props.percent);
    return (
      <div
        className="progress-bar"
        ref="progressBar"
        onMouseDown={(e) => {
          this.handleMouseDown(e);
        }}
      >
        <div className="bar-inner">
          <div className="progress" ref="progress" id={"progress"} />
          <div
            className="progress-btn-wrapper"
            ref="progressBtn"
            id={"progressBtn"}
          >
            <div className="progress-btn" />
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.progressBtnWidth = document.getElementById("progressBtn").clientWidth;
  }

  handleMouseDown(e) {
    const offsetWidth = Math.max(
      0,
      Math.min(
        e.nativeEvent.pageX - this.refs.progressBar.getBoundingClientRect().x,
        this.refs.progressBar.clientWidth
      )
    );
    this._offset(offsetWidth);
    this.triggerPercent();
  }
  //由于mousemove事件存在延迟 难以实现拖拽效果 直接使用点击效果
  text(e) {
    this.touch.initiated = true;
    this.touch.startX = e.nativeEvent.pageX;
    //实际进度条的宽度
    this.touch.left = this.refs.progress.clientWidth;
    const callback = (event) => {
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = event.pageX - this.touch.startX;
      console.log(this.touch.left, "left");
      console.log(deltaX, "deltaX");
      const offsetWidth = Math.min(
        this.refs.progressBar.clientWidth - this.progressBtnWidth,
        Math.max(0, this.touch.left + deltaX)
      );
      this._offset(offsetWidth);
    };
    document.body.addEventListener("mousemove", callback);
    document.body.addEventListener("mouseup", () => {
      document.body.removeEventListener("mousedown", callback);
      this.touch.initiated = false;
    });
  }

  _offset(offsetWidth) {
    const fontSize = document
      .getElementsByTagName("html")[0]
      .style.fontSize.toString()
      .split("px")[0];
    this.refs.progress.style.width = `${offsetWidth / fontSize}rem`;
    this.refs.progressBtn.style["transform"] = `translate3d(${
      offsetWidth / fontSize
    }rem,0,0)`;
  }
  triggerPercent() {
    this.props.percentChange(this.getPercent());
  }
  getPercent() {
    const barWidth = this.refs.progressBar.clientWidth;
    return this.refs.progress.clientWidth / barWidth;
  }
  setProgressOffset(percent) {
    setTimeout(() => {
      if (percent > 0 && this.refs.progressBar) {
        const barWidth = this.refs.progressBar.clientWidth;
        const offsetWidth = percent * barWidth;
        this._offset(offsetWidth);
      }
    });
  }
}
ProgressBar.propTypes = {
  percentChange: PropTypes.func.isRequired,
  percent: PropTypes.number.isRequired,
};
export default ProgressBar;
