import { combineReducers } from "redux-immutable";
import { fromJS } from "immutable";
import * as constants from "./constants";
import SongSheetReducer from "../pages/songSheet/store/reducer";
import SingerReducer from "../pages/singer/store/reducer";
const defaultAppState = fromJS({
  loading: false,
  searchStatus: false,
  user: {},
  currentHeaderIndex: 0,
  headerStatus: true,
  scrollTop: 0,
});
const appReducer = (state = defaultAppState, action) => {
  switch (action.type) {
    case constants.SET_TOP_LOADING:
      return state.set("loading", action.loading);
    case constants.SET_SEARCH_STATUS:
      return state.set("searchStatus", action.status);
    case constants.SET_USER:
      return state.set("user", action.user);
    case constants.SET_CURRENT_HEADER_INDEX:
      return state.set("currentHeaderIndex", action.index);
    case constants.SET_HEADER_STATUS:
      return state.set("headerStatus", action.status);
    case constants.SET_SCROLL_TOP:
      return state.set("scrollTop", action.scrollTop);
    default:
      return state;
  }
};
const reducer = combineReducers({
  app: appReducer,
  songSheet: SongSheetReducer,
  singer: SingerReducer,
});
export default reducer;
