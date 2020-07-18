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
