import request from "./request";

//歌单分类
export function getCatList(cancelToken) {
  const url = "/playlist/catlist";
  return request({ url, method: "get", cancelToken });
}

//歌单
export function getPlayList(cat = "全部", offset = 0, cancelToken) {
  const url = "/top/playlist";
  return request({ url, method: "get", params: { cat, offset }, cancelToken });
}
