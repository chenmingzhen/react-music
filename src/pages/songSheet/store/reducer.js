import { fromJS } from "immutable";
import * as constants from "./constants";

const defaultState = fromJS({
  position: { type: "全部", offset: 0 },
});

export default (state = defaultState, action) => {
  switch (action.type) {
    case constants.SET_SONGSHEET_POSITION:
      return state.set("position", fromJS(action.position));
    default:
      return state;
  }
};
