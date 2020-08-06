import request from "./request";

//获取歌单详情

export function getPlayList(id, cancelToken) {
  const url = "/playlist/detail";
  return request({ url, method: "get", params: { id }, cancelToken });
}

//歌单评论
export function getListComment(id, offset, cancelToken) {
  const url = "/comment/playlist";
  return request({ url, method: "get", params: { id, offset }, cancelToken });
}

//点赞
export function likeComment(id, cid, t, type) {
  const url = "comment/like";
  return request({ url, method: "get", params: { id, cid, t, type } });
}

//日推歌曲
export function getDailyRecommend(cancelToken) {
  const url = "/recommend/songs";
  return request({ url, method: "get", cancelToken }).catch((e) => {});
}
