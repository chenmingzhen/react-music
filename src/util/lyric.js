import { getLyric } from "../api/play";

export function _getLyric(id) {
  return new Promise((resolve, reject) => {
    getLyric(id).then((data) => {
      resolve(data);
    });
  });
}
