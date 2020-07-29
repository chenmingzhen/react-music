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
export function getMvComment(id, cancelToken) {
  const url = "/comment/mv";
  return request({ url, method: "get", params: { id }, cancelToken });
}

//mv simi
export function getMvSimi(mvid, cancelToken) {
  const url = "/simi/mv";
  return request({ url, method: "get", params: { mvid }, cancelToken });
}
