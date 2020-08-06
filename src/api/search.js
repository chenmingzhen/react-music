import request from "./request";

//热门搜索
export function getHotSearch(cancelToken) {
  const url = "/search/hot";
  return request({ url, method: "get", cancelToken });
}

//搜索建议
export function getSearchSuggestion(keywords, cancelToken) {
  const url = "/search/suggest";
  return request({ url, method: "get", params: { keywords }, cancelToken });
}

//搜索
//type: 搜索类型；
// 默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单,
// 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
export function getSearchResult(keywords, type, limit, offset, cancelToken) {
  const url = "/search";
  return request({
    url,
    method: "get",
    params: { keywords, type, limit, offset },
    cancelToken,
  });
}
