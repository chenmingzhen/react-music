import React from "react";
import "./_style.scss";
import BScroll from "@better-scroll/core";
import ScrollBar from "@better-scroll/scroll-bar";
import MouseWheel from "@better-scroll/mouse-wheel";
import PropTypes from "prop-types";
class Scroller extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    BScroll.use(ScrollBar);
    BScroll.use(MouseWheel);
    this.defaultOptions = {
      mouseWheel: true,
      scrollY: true,
      scrollbar: true,
      probeType: 3,
    };
  }

  componentDidUpdate() {
    if (!this.scroller) {
      this.scroller = new BScroll(
        this.refs.scroller,
        Object.assign({}, this.defaultOptions, this.options)
      );
      this.props.init(this.scroller);
    } else {
      this.scroller && this.scroller.refresh();
    }
  }

  render() {
    return (
      <div ref="scroller" className={"scroller " + this.props.className}>
        {this.props.children}
      </div>
    );
  }

  getScroller() {
    return this.scroller;
  }

  refresh() {
    this.scroller.refresh();
  }
}

Scroller.propTypes = {
  data: PropTypes.array,
  options: PropTypes.object,
};

Scroller.defaultProps = {
  data: [],
  options: {},
};

export default Scroller;
