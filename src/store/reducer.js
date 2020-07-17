import { combineReducers } from "redux-immutable";
import { fromJS } from "immutable";
import * as constants from "./constants";

const defaultAppState = fromJS({
  loading: false,
  searchStatus: false,
  user: {},
});
const appReducer = (state = defaultAppState, action) => {
  switch (action.type) {
    case constants.SET_TOP_LOADING:
      return state.set("loading", action.loading);
    case constants.SET_SEARCH_STATUS:
      return state.set("searchStatus", action.status);
    case constants.SET_USER:
      return state.set("user", action.user);
    default:
      return state;
  }
};
const reducer = combineReducers({ app: appReducer });
export default reducer;
