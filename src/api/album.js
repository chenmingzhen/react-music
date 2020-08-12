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

export function subAlbum(id, t, cancelToken) {
  const url = "/album/sub";
  return request({
    url,
    method: "get",
    params: { id, t },
    cancelToken,
  });
}

export function albumDynamic(id, cancelToken) {
  const url = "/album/detail/dynamic";
  return request({
    url,
    method: "get",
    params: { id },
    cancelToken,
  });
}
