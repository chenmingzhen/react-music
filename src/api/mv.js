import request from "./request";

//获取mv url
export function getMvurl(id, cancelToken) {
  const url = "/mv/url";
  return request({ url, method: "get", params: { id }, cancelToken });
}

//mv detail
export function getMvDetail(mvid, cancelToken) {
  const url = "/mv/detail";
  return request({ url, method: "get", params: { mvid }, cancelToken });
}

//mv comment
export function getMvComment(id, offset, cancelToken) {
  const url = "/comment/mv";
  return request({ url, method: "get", params: { id, offset }, cancelToken });
}

//mv simi
export function getMvSimi(mvid, cancelToken) {
  const url = "/simi/mv";
  return request({ url, method: "get", params: { mvid }, cancelToken });
}

export function getsubMv(cancelToken) {
  const url = "/mv/sublist";
  return request({ url, method: "get", cancelToken });
}

//收藏MV
export function subMv(mvid, t, cancelToken) {
  const url = "/mv/sub";
  return request({ url, method: "get", params: { mvid, t }, cancelToken });
}
