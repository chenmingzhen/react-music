import request from "./request";


/*手机登陆*/
export function login(phone,password,cancelToken) {
    const url='/login/cellphone';
    return request({url, method: 'get', params: {phone,password},cancelToken});
}
//退出登录
export function logout(){
    const url='/logout'
    return request({url, method: 'get'});
}

