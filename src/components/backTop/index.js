import React from "react";
import "./_styles.scss";

class BackTop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            intervalId: 0,
        };
        this.ele = document.getElementById(props.ele);
    }

    scrollStep() {
        if (this.ele.scrollTop === 0) {
            clearInterval(this.state.intervalId);
        }
        //edge没有这个方法
        if (!this.ele.scroll) {
            //兼容edge
            this.ele.scrollTop = this.ele.scrollTop - this.props.scrollStepInPx;
        } else {
            this.ele.scroll(0, this.ele.scrollTop - this.props.scrollStepInPx);
        }

    }

    scrollToTop() {
        let intervalId = setInterval(
            this.scrollStep.bind(this),
            this.props.delayInMs
        );
        this.setState({intervalId: intervalId});
    }

    render() {
        return (
            <button
                title="Back to top"
                className="scroll"
                onClick={() => {
                    this.scrollToTop();
                }}
            >
                <i className="arrow-up iconfont icon-youjiantou"></i>
            </button>
        );
    }
}

export default BackTop;
