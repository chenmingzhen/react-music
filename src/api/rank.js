import request from "./request";

/*排行榜*/

//https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=%e6%8e%92%e8%a1%8c%e6%a6%9c
export function getRank(idx, cancelToken) {
  const url = "/top/list";
  return request({ url, method: "get", params: { idx }, cancelToken });
}
