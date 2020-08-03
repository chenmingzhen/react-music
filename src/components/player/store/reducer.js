import { fromJS } from "immutable";
import * as constants from "./constants";

const defaultPlayer = fromJS({
  currentIndex: 0,
  playlist: [],
  fullScreen: false,
  playing: false,
});
const playerReducer = (state = defaultPlayer, action) => {
  switch (action.type) {
    case constants.SET_CURRENT_INDEX:
      return state.set("currentIndex", action.currentIndex);
    case constants.SET_PLAYING:
      return state.set("playing", action.result);
    case constants.SET_FULLSCREEN:
      return state.set("fullScreen", action.result);
    case constants.SET_PLAYLIST:
      return state.set("playlist", fromJS(action.playlist));
    default:
      return state;
  }
};
export default playerReducer;
