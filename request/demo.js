// 引入文件
import request from '@/utils/request.js';

// 设置全局参数
request.setConfig({
  url:"http://www.baidu.com", // 基地址,  可选
  dataType:"json",  // 传参方式, 可选
  header:{  // 请求头, 可选
    token:"xxxx"
  }
});

/**
 * @description: 请求拦截器
 * @param {object} 当前请求配置参数
 * @return 不return对象，则不发送当前请求
 */
request.interceptors.request(config => { 
  return config;
});

/**
 * @description: 响应拦截器
 * @param {object} 当前请求成功回调数据
 * @return 不return对象，则不返回数据
 */
request.interceptors.response(res => {
  return res;
});

let e = Request
    .get({
        url: "/get",
        header: {
            "content-type": "application/json"
        },
        data: {
            name: "xxx",
        }
    })

e
    .then(res => {
        // do something
    })
    .catch(res => {
        // do something
    })
    .finally(() => {
        // do something
    })

// 停止发送请求
Request.stop(e)
