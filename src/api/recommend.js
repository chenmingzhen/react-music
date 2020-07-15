import request from "./request";

/*返回banner*/

//https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=banner
export function getBanner() {
    const url = '/banner';
    return request({url, method: 'get', params: {type: '0'}});
}

/*官方歌单*/
export function getOfficialColumn(limit = 1) {
    const url = '/personalized';
    return request({url, method: 'get', params: {limit}});
}

/*达人歌单*/

//https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=歌单-网友精选碟-
export function getExcellentColumn(limit = 6, order = 'new') {
    const url = '/top/playlist';
    return request({url, method: 'get', params: {limit, order}});
}

/*分类歌单*/

//https://binaryify.github.io/NeteaseCloudMusicApi/#/?id=%e8%8e%b7%e5%8f%96%e7%b2%be%e5%93%81%e6%ad%8c%e5%8d%95
export function getCategoryColumn(limit = 6, cat = '华语') {
    const url = '/top/playlist/highquality';
    return request({url, method: 'get', params: {limit, cat}});
}

/*歌单详细*/
export function getPlayList(id) {
    const url = '/playlist/detail';
    return request({url, method: 'get', params: {id}});
}

//最新音乐
export function getNewSong() {
    const url = '/personalized/newsong';
    return request({url, method: 'get'});
}

//推荐Mv
export function getRecommendMv() {
    const url = '/personalized/mv';
    return request({url, method: 'get'});
}
