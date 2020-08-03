import * as constants from "./constants";

export const setPlayList = (playlist) => ({
  type: constants.SET_PLAYLIST,
  playlist,
});

export const setCurrentIndex = (currentIndex) => ({
  type: constants.SET_CURRENT_INDEX,
  currentIndex,
});

export const setFullScreen = (result) => ({
  type: constants.SET_FULLSCREEN,
  result,
});

export const setPlaying = (result) => ({
  type: constants.SET_PLAYING,
  result,
});
