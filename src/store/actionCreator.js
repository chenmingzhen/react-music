import * as constants from './constants';
import {fromJS} from 'immutable';

//APP
export const changeLoading = (loading) => ({
    type: constants.SET_TOP_LOADING,
    loading
});
export const changeSearchStatus = (status) => ({
    type: constants.SET_SEARCH_STATUS,
    status
});
