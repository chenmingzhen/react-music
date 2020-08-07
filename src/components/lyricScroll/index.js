import React from "react";
import BScroll from "better-scroll";
import PropTypes from "prop-types";
class LyricScroll extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div ref="wrapper" className={this.props.className + " wrapper"}>
        {/* 这里要有一个容器 不然会报style not found错误 这里相当于vue的插槽 */}
        <React.Fragment>{this.props.children}</React.Fragment>
      </div>
    );
  }

  componentDidMount() {
    this._initScroll();
  }

  componentDidUpdate() {
    setTimeout(() => {
      this.refresh();
    }, this.refreshDelay);
  }

  _initScroll() {
    if (!this.refs.wrapper) return;
    this.scroll = new BScroll(this.refs.wrapper, {
      mouseWheel: true,
      scrollY: true,
      scrollbar: true,
      probeType: 3,
    });
  }
  refresh() {
    this.scroll && this.scroll.refresh();
  }
  scrollTo() {
    console.log("scrollTo", this.scroll);
    this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
  }
  scrollToElement() {
    console.log("scrollToElement", this.scroll);
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
  }
}

LyricScroll.propTypes = {
  data: PropTypes.array,
  refreshDelay: PropTypes.number,
};

LyricScroll.defaultProps = {
  data: null,
  refreshDelay: 20,
};

export default LyricScroll;
