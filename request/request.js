/*
 * @Description: uniapp request请求库 v1.0
 * @Author: pocky
 * @Date: 2019-05-31 19:18:48
 * @LastEditTime: 2019-06-02 15:39:01
 * @LastEditors: Please set LastEditors
 * @instruction：https://www.yuque.com/docs/share/79ba2a9c-fb1f-41d5-a1dc-18a6e2d9eda4
 * @github: https://github.com/2460392754/uniapp-tools/tree/master/request
 */

const commonRequest = Symbol('commonRequest'),
    commonConfig = Symbol('commonConfig'),
    joinUrl = Symbol('joinUrl'),
    setContentType = Symbol('setContentType'),
    interceptors = Symbol('interceptors'),
    error = Symbol('error');

class Request {
    // 初始化
    constructor() {
        this.config = {};
        this[interceptors] = {
            request: null,
            response: null
        };
        this.interceptors = {
            request: fn => {
                this[interceptors].request = fn;
            },
            response: fn => {
                this[interceptors].response = fn;
            }
        }
    }

    // 获取配置数据
    getConfig () {
        return this.config;
    }

    // 设置配置数据
    setConfig (config = {}) {
        const newConfig = {};
        let contentType = this[setContentType](config.contentType);

        newConfig.url = config.url || "";
        newConfig.dataType = config.dataType || "json";
        newConfig.responseType = config.responseType || "text";

        newConfig.header = {
            "content-type": contentType,
            ...config.header
        }

        this.config = newConfig;
    }

    // get请求
    get (config = {}) {
        this.config = this[commonConfig](config, "get");

        return this[commonRequest](this.config);
    }

    // post请求
    post (config = {}) {
        this.config = this[commonConfig](config, "post");

        console.log(this.config)

        return this[commonRequest](this.config);
    }

    // 设置header中content-type参数,默认添加utf-8
    [setContentType] (type) {
        let str = "";

        if (type === "form" || typeof type === "undefined") {
            str = 'application/x-www-form-urlencoded';
        } else if (type === "json") {
            str = 'application/json';
        } else if (type === "file") {
            str = 'multipart/form-data';
        } else {
            this[error]("contentType参数错误");
        }

        str += ";charset=UTF-8";

        return str;
    }

    /**
     * @description: 拼接 url, 自动判断添加斜杠 "/"
     * @param {string} url 相对或绝对路径
     * @return: 完整的绝对路径
     */
    [joinUrl] (url) {
        const beforeUrlHasSlash = this.config.url.lastIndexOf('/') + 1 == this.config.url.length;
        const afterUrlHasSlash = url.indexOf('/') == 0;

        if (url.length === 0 || (this.config.url !== "" && !isCompleteUrl(this.config.url))) {
            this[error]("url参数错误");
        }

        if (isCompleteUrl(url)) {
            return url;
        }

        if (beforeUrlHasSlash && afterUrlHasSlash) {
            return this.config.url + url.substr(1);
        }

        if (beforeUrlHasSlash || afterUrlHasSlash) {
            return this.config.url + url;
        }

        if (!beforeUrlHasSlash && !afterUrlHasSlash) {
            return this.config.url + '/' + url;
        }

        function isCompleteUrl (str) {
            return /(http|https):\/\/([\w.]+\/?)\S*/.test(str);
        }
    }

    /**
     * @description: 公共配置
     * @todo: responseType参数配置无效
     * @param {object} config 新的配置数据
     * @param {string} method 请求类型 
     * @return: return一个完整的配置数据
     */
    [commonConfig] (config, method) {
        const newConfig = {};
        const url = this[joinUrl](config.url || "");
        const header = {
            ...this.config.header,
            ...config.header
        };

        if (config.contentType && !(config.header && typeof config.header["content-type"]) === "undefined") {
            header["content-type"] = this[setContentType](config.contentType);
        }

        newConfig.url = url;
        newConfig.method = method;
        newConfig.header = header;
        newConfig.dataType = config.dataType || "json";
        newConfig.responseType = config.responseType || "text";
        newConfig.data = config.data || {};
        newConfig.success = config.success || null;
        newConfig.fail = config.fail || null;
        newConfig.complete = config.complete || null;

        return newConfig;
    }

    // 公共请求方法, 支持对对象中内嵌函数或Promise
    [commonRequest] (config) {
        const request = () => {
            if (typeof this[interceptors].request === "function") {
                const ret = this[interceptors].request(config);

                if (!ret) return false;

                config = ret;
            }

            return true;
        }

        const response = (res) => {
            if (typeof this[interceptors].response === "function") {
                const ret = this[interceptors].response(res);

                return ret ? ret : false;
            }

            return res;
        }


        /**
         * @todo: 回调判断问题
         */
        return new Promise((resolve, reject) => {
            if (!request()) return false;

            uni.request({
                ...config,
                success: res => {
                    const newRes = response(res);

                    if (newRes === false) return false;

                    res = newRes;
                    config.success ? config.success(res) : resolve(res);
                },
                fail: res => {
                    config.fail ? config.fail(res) : reject(res);
                },
                complete: res => {
                    if (!config.complete) return false;

                    const newRes = response(res);

                    if (newRes === false) return false;

                    res = newRes;
                    config.complete(res);
                }
            });
        });
    }

    /**
     * @description: 抛出错误
     * @param {string} str 错误说明
     */
    [error] (str) {
        throw new Error("[request error]: " + str)
    }
}

// 设置全局唯一
if (!global.$request) global.$request = new Request();

export default global.$request;
