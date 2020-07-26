import request from "./request";

/*获取歌词*/
export function getLyric(id) {
  const url = "/lyric";
  return request({ url, method: "get", params: { id } });
}
