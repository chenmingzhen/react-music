import * as constants from "./constants";

//APP
export const changeLoading = (loading) => ({
  type: constants.SET_TOP_LOADING,
  loading,
});
export const changeSearchStatus = (status) => ({
  type: constants.SET_SEARCH_STATUS,
  status,
});
export const setUser = (user) => ({
  type: constants.SET_USER,
  user,
});
export const setCurrentHeaderIndex = (index) => ({
  type: constants.SET_CURRENT_HEADER_INDEX,
  index,
});
export const setHeaderStatus = (status) => ({
  type: constants.SET_HEADER_STATUS,
  status,
});
export const setScrollTop = (scrollTop) => ({
  type: constants.SET_SCROLL_TOP,
  scrollTop,
});
export const setMiddle = (result) => ({
  type: constants.SET_MIDDLE,
  result,
});
export const setSearchControl = (result) => ({
  type: constants.SET_SEARCH_CONTROL,
  result,
});
