import request from "./request";

//获取专辑内容
export function getAlbumContent(id, cancelToken) {
  const url = "/album";
  return request({ url, method: "get", params: { id }, cancelToken });
}

//获取专辑评论
export function getAlbumComment(id, offset, cancelToken) {
  const url = "/comment/album";
  return request({
    url,
    method: "get",
    params: { id, offset },
    cancelToken,
  });
}
