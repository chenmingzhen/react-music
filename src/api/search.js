import request from "./request";

//热门搜索
export function getHotSearch() {
  const url = "/search/hot";
  return request({ url, method: "get" });
}

//搜索建议
export function getSearchSuggestion(keywords) {
  const url = "/search/suggest";
  return request({ url, method: "get", params: { keywords } });
}
