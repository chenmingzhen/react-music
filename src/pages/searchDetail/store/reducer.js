import { fromJS } from "immutable";
import * as constants from "./constants";
const defaultSearchState = fromJS({ offset: 0, type: 1 });

export default (state = defaultSearchState, action) => {
  switch (action.type) {
    case constants.SET_SEARCH_OFFSET:
      return state.set("offset", action.offset);
    case constants.SET_SEARCH_TYPE:
      return state.set("type", action.searchType);
    default:
      return state;
  }
};
