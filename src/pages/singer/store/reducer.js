import { fromJS } from "immutable";
import * as constants from "./constants";

const defaultSingerState = fromJS({
  currentInitial: "热门",
  currentArea: "全部",
  currentGender: "全部",
  offset: 0,
  singerList: [],
});

export default (state = defaultSingerState, action) => {
  switch (action.type) {
    case constants.SET_CURRENT_INITIAL:
      return state.set("currentInitial", action.currentInitial);
    case constants.SET_CURRENT_AREA:
      return state.set("currentArea", action.currentArea);
    case constants.SET_CURRENT_GENDER:
      return state.set("currentGender", action.currentGender);
    case constants.SET_OFFSET:
      return state.set("offset", action.offset);
    case constants.SET_SINER_LIST:
      return state.set("singerList", action.singerList);
    default:
      return state;
  }
};
