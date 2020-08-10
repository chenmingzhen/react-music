import request from "./request";

/*获取喜欢的音乐*/

//https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=%e5%96%9c%e6%ac%a2%e9%9f%b3%e4%b9%90%e5%88%97%e8%a1%a8
export function getLikeMusic(id) {
  const url = "/likelist";
  return request({ url, method: "get", params: { id } });
}

/*获取用户歌单*/

//https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=%e8%8e%b7%e5%8f%96%e7%94%a8%e6%88%b7%e6%ad%8c%e5%8d%95
export function getPlayList(uid, cancelToken) {
  const url = "/user/playlist";
  return request({ url, method: "get", params: { uid }, cancelToken });
}

/*获取收藏的歌手*/
//https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=%e6%94%b6%e8%97%8f%e7%9a%84%e6%ad%8c%e6%89%8b%e5%88%97%e8%a1%a8
/*需要登陆才能获取*/
export function getSubscribeSinger() {
  const url = "/artist/sublist";
  return request({ url, method: "get" });
}

//已喜欢音乐id列表
export function getLikeSongListId(id, cancelToken) {
  const url = "/likelist";
  return request({ url, method: "get", params: { id }, cancelToken });
}

//喜欢或不喜欢音乐
export function likeOrDisLikeMusic(id, like, cancelToken) {
  const url = "/like";
  return request({ url, method: "get", params: { id, like }, cancelToken });
}

export function getSubAlbum(cancelToken) {
  const url = "/album/sublist";
  return request({ url, method: "get", params: { limit: 50 }, cancelToken });
}
