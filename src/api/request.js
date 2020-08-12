import axios from "axios";

export const statusSuccess = 200;

axios.defaults.withCredentials = true;

const url = "http://193.112.175.198:4000";
const request = axios.create({
  baseURL: url,
  timeout: 20000,
});

/*响应拦截器  精简返回的数据*/
request.interceptors.response.use((response) => {
  const res = response.data;
  if (res.code !== statusSuccess) {
    return Promise.reject(new Error(res.msg));
  } else {
    return res;
  }
});
export default request;
