import Interceptor from "./core/interceptor";
import Request from "./index";

export const globalInterceptor = {
  request: new Interceptor(),
  response: new Interceptor()
};

/**
 * 全局配置
 * 只能配置 静态数据
 * `content-type` 默认为 application/json
 * `header` 中`content-type`设置特殊参数 或 配置其他会导致触发 跨域 问题，出现跨域会直接进入响应拦截器的catch函数中
 */
export const config = {
  baseURL: "https://www.fastmock.site/mock/7f2e97ecf7a26f51479a4a08f6c49c8b",
  header: {
    // 'X-Auth-Token': 'xxxx',
    contentType: "application/x-www-form-urlencoded"
    // 'Content-Type': 'application/json'
  }
};

/**
 * 全局 请求拦截器, 支持添加多个拦截器
 * 例如: 配置token、添加一些默认的参数
 *
 * `return config` 继续发送请求
 * `return false` 会停止发送请求，不会进入错误数据拦截，也不会进入请求对象中的catch函数中
 * `return Promise.reject('xxxxx')` 停止发送请求, 会错误数据拦截，也会进入catch函数中
 *
 * @param {Object} config 发送请求的配置数据
 */
globalInterceptor.request.use(
  config => {
    console.log("is global request interceptor");

    return config;
  },
  err => {
    console.error("is global fail request interceptor: ", err);
    return false;
  }
);

/**
 * 全局 响应拦截器, 支持添加多个拦截器
 * 例如: 根据状态码选择性拦截、过滤转换数据
 *
 * `return res` 继续返回数据
 * `return false` 停止返回数据，不会进入错误数据拦截，也不会进入catch函数中
 * `return Promise.reject('xxxxx')` 返回错误信息, 会错误数据拦截，也会进入catch函数中
 *
 * @param {Object} res 请求返回的数据
 * @param {Object} config 发送请求的配置数据
 * @return {Object|Boolean|Promise<reject>}
 */
globalInterceptor.response.use(
  (res, config) => {
    return res;
  },
  (err, config) => {
    console.error("is global response fail interceptor");
    console.error("err: ", err);
    console.error("config: ", config);

    return Promise.reject(err);
  }
);
