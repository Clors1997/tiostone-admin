import axios from "axios";
import NProgress from 'nprogress' // progress bar
import router from "@/router";

// create an axios instance
const service = axios.create({
  baseURL: process.env.API_HOST, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000, // request timeout
  headers:
    {
      "Content-Type": "application/x-www-form-urlencoded",
    }
});
//request interceptor
service.interceptors.request.use(
  config => {
    NProgress.start()
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.common["Authorization"] = token;
    }
    config.headers.token = sessionStorage.tiotoken;

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
service.interceptors.response.use(res => {
  // // 响应失败
  // if (!res.data.success) {
  //   Toast(res.data.msg)
  //   Indicator.close()
  // }

  // /**
  // * refresh_token过期
  // * 1、清空本地token
  // * 2、刷新页面
  // */
  // if (res.data.code === '004-1') {
  //   localStorage.setItem('TOKEN', '')
  //   window.location.reload()
  // }
  if(res.data.token != undefined){
    console.log(res.data.token);
    sessionStorage.tiotoken = res.data.token;
  }
  if(res.data.rc == -100){
    sessionStorage.tiotoken = "";
    router.push("/tiostone/login");
  }
  NProgress.done()
  return res.data
}, error => {
  NProgress.done()
  // Toast(error.message)
  // Indicator.close()
})

export default service;
