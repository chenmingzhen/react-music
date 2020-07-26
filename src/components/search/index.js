import React from "react";
import "./_style.scss";
import { changeSearchStatus } from "../../store/actionCreator";
import { connect } from "react-redux";

class Search extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return <>search-wrapper</>;
  }
}

const mapState = (state) => ({
  searchStatus: state.getIn(["app", "searchStatus"]),
});

const mapDispatch = (dispatch) => ({
  changeSearchStatus(result) {
    dispatch(changeSearchStatus(result));
  },
});

export default connect(mapState, mapDispatch)(Search);
