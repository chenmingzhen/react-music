import * as constants from "./constants";
export const setSearchOffset = (offset) => ({
  type: constants.SET_SEARCH_OFFSET,
  offset,
});
export const setSearchType = (searchType) => ({
  type: constants.SET_SEARCH_TYPE,
  searchType,
});
