import request from "./request";

//歌单分类
export function getCatList() {
  const url = "/playlist/catlist";
  return request({ url, method: "get" });
}

//歌单
export function getPlayList(cat = "全部", offset = 0) {
  const url = "/top/playlist";
  return request({ url, method: "get", params: { cat, offset } });
}
