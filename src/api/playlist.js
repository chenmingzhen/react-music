import request from "./request";

//获取歌单详情

export function getPlayList(id) {
  const url = "/playlist/detail";
  return request({ url, method: "get", params: { id } });
}

//歌单评论
export function getListComment(id, offset) {
  const url = "/comment/playlist";
  return request({ url, method: "get", params: { id, offset } });
}

//点赞
export function likeComment(id, cid, t, type) {
  const url = "comment/like";
  return request({ url, method: "get", params: { id, cid, t, type } });
}

//日推歌曲
export function getDailyRecommend() {
  const url = "/recommend/songs";
  return request({ url, method: "get"});
}
