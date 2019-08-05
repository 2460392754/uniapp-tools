/*
 * @Description: uniapp request请求库 v1.2.1
 * @Author pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-05-31 19:18:48
 * @LastEditTime: 2019-08-05 12:38:39
 * @instruction https://www.yuque.com/pocky/aaeyux/neg4m1
 * @github https://github.com/2460392754/uniapp-tools/tree/master/request
 * @dcloud https://ext.dcloud.net.cn/plugin?id=468
 */

class Request {
    addInterceptors;

    constructor() {
        this.addInterceptors = {
            request: fn => {
                _.interceptors.request = fn;
            },
            response: fn => {
                _.interceptors.response = fn;
            }
        }
    }

    // 获取全局配置
    getConfig () {
        return _.config;
    }

    // 设置全局配置
    setConfig (config = {}) {
        let defaultConfig = {
            url: '',
            dataType: 'json',
            responseType: 'text'
        }

        let newConfig = {
            ...defaultConfig,
            ...config
        }

        _.config = newConfig;
    }

    // get请求
    get (config) {
        let newConfig = _.mergeConfig(config, 'get');

        return _.request(newConfig);
    }

    // post请求
    post (config) {
        let newConfig = _.mergeConfig(config, 'post');

        return _.request(newConfig);
    }

    // 停止发送请求
    stop (obj) {
        if (obj && obj.example && obj.example.abort) {
            obj.example.abort();
        } else {
            _.error('参数错误, 无法停止发送请求');
        }
    }
}

var _ = {
    config: {
        url: '',
        dataType: '',
        responseType: '',
        header: {},
        data: {},
        contentType: undefined,
    },

    interceptors: {
        request: null,
        response: null
    },

    // 拼接 url，返回完整的资源定位符(url)
    joinUrl: function (url) {
        let configUrl = _.config.url,
            beforeUrlHasSlash = configUrl.lastIndexOf('/') + 1 === configUrl.length,
            afterUrlHasSlash = url.indexOf('/') === 0;

        if (url.length === 0 || !_.isCompleteUrl(configUrl)) {
            _.error('url参数不完整或者错误');
        }

        if (_.isCompleteUrl(url)) {
            return url;
        }

        if (beforeUrlHasSlash && afterUrlHasSlash) {
            return configUrl + url.substr(1);
        }

        if (beforeUrlHasSlash || afterUrlHasSlash) {
            return configUrl + url;
        }

        if (!beforeUrlHasSlash && !afterUrlHasSlash) {
            return configUrl + '/' + url;
        }
    },

    // 是否是完整的 url 
    isCompleteUrl: function (url) {
        return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);
    },

    // 合并header中content-type参数,默认添加utf-8
    mergeContentType: function (type = 'form') {
        let str = "";

        if (type === "form" || typeof type === "undefined") {
            str = 'application/x-www-form-urlencoded';
        } else if (type === "json") {
            str = 'application/json';
        } else if (type === "file") {
            str = 'multipart/form-data';
        } else {
            _.error("contentType参数错误");
        }

        str += ";charset=UTF-8";

        return str;
    },

    // 合并配置（全局配置+实例中的配置,实例中的优先级更高）
    mergeConfig: function (config, method) {
        let url = _.joinUrl(config.url),
            contentType = _.mergeContentType(config.contentType || _.config.contentType),
            header = {
                'content-type': contentType,
                ..._.config.header,
                ...config.header
            },
            newConfig = {
                ...config,
                ..._.config,
                url,
                method,
                header
            }

        return newConfig;
    },

    // 请求拦截器
    interceptorsReq: function (config) {
        if (typeof _.interceptors.request === 'function') {
            let ret = _.interceptors.request(config);

            if (!ret) return false;
            config = ret;
        }

        return true;
    },

    // 响应拦截器
    interceptorsRep: function (res) {
        if (typeof _.interceptors.response === 'function') {
            let ret = _.interceptors.response(res);

            return ret ? ret : false;
        }

        return res;
    },

    // 公共请求方法, 支持对象中callback或Promise
    request: function (config) {
        let canRetRep = true,
            example,
            ret;

        if (!_.interceptorsReq(config)) return;

        ret = new Promise((resolve, reject) => {
            example = uni.request({
                ...config,

                success: res => {
                    let newRes = _.interceptorsRep(res);

                    if (!!!newRes) {
                        canRetRep = false;
                        return false;
                    }

                    if (Object.prototype.toString.call(newRes) === '[object Promise]') {
                        config.fail && newRes.catch(config.fail)
                        return false;
                    }

                    config.success ? config.success(newRes) : resolve(newRes);
                },
                fail: err => {
                    let newErr = _.interceptorsRep(err);

                    if (!!!newErr) {
                        canRetRep = false;
                        return false;
                    }

                    config.fail ? config.fail(newErr) : reject(newErr)
                },
                complete: res => {
                    if (!config.complete || !canRetRep) return false;

                    config.complete(res);
                }
            });
        });

        /**
         * @todo 修改了__proto__(隐式原型)的属性
         */
        ret.__proto__.example = example;
        // ret.example = example;

        return ret;
    },

    // 抛出错误
    error: function (str) {
        throw new Error('[request error]: ' + str);
    }
}

export default new Request();