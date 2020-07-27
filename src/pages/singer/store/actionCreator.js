import * as constants from "./constants";

export const setCurrentInitial = (currentInitial) => ({
  type: constants.SET_CURRENT_INITIAL,
  currentInitial,
});
export const setCurrentArea = (currentArea) => ({
  type: constants.SET_CURRENT_AREA,
  currentArea,
});
export const setCurrentGender = (currentGender) => ({
  type: constants.SET_CURRENT_GENDER,
  currentGender,
});
export const setOffset = (offset) => ({
  type: constants.SET_OFFSET,
  offset,
});
