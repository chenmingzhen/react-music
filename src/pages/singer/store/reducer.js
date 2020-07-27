import { fromJS } from "immutable";
import * as constants from "./constants";

const defaultSingerState = fromJS({
  currentInitial: "热门",
  currentArea: "全部",
  currentGender: "全部",
  offset: 0,
});

export default (state = defaultSingerState, action) => {
  switch (action.type) {
    case constants.SET_CURRENT_INITIAL:
      return state.set("singer", action.currentInitial);
    case constants.SET_CURRENT_AREA:
      return state.set("singer", action.currentArea);
    case constants.SET_CURRENT_GENDER:
      return state.set("singer", action.currentGender);
    case constants.SET_OFFSET:
      return state.set("singer", action.offset);
    default:
      return state;
  }
};
