/*
 * @Description: uniapp request请求库 v1.2.2
 * @Author pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-05-31 19:18:48
 * @LastEditTime: 2019-08-06 16:00:41
 * @instruction https://www.yuque.com/pocky/aaeyux/xwgrav
 * @github https://github.com/2460392754/uniapp-tools/tree/master/request
 * @dcloud https://ext.dcloud.net.cn/plugin?id=468
 */

class MyRequest {
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

        _.config = {
            ...defaultConfig,
            ...config
        }
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
        try {
            if (obj.example.abort && typeof obj.example.abort === 'function') {
                obj.example.abort();
            }
        } catch (err) {
            _._error('参数错误, 无法停止发送请求')
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
        contentType: 'form',
    },

    interceptors: {
        request: null,
        response: null
    },

    // 合并url，返回完整的资源定位符
    mergeUrl (url) {
        const configUrl = _.config.url;
        const beforeUrlHasSlash = configUrl.lastIndexOf('/') + 1 === configUrl.length;
        const afterUrlHasSlash = url.indexOf('/') === 0;

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
    isCompleteUrl (url) {
        return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);
    },

    // 合并header中content-type参数, 默认添加utf-8
    mergeContentType (type = 'form') {
        let tmpStr = '';

        switch (type) {
            case 'form' || 'undefined':
                tmpStr = 'application/x-www-form-urlencoded';
                break;

            case 'json':
                tmpStr = 'application/json';
                break;

            case 'file':
                tmpStr = 'multipart/form-data';
                break;

            default:
                _.error("contentType参数错误");
        }

        return tmpStr + ";charset=UTF-8";
    },

    // 合并配置（全局配置+实例中的配置,实例中的优先级更高）
    mergeConfig (config, method) {
        const url = _.mergeUrl(config.url);
        const contentType = _.mergeContentType(config.contentType || _.config.contentType);
        const header = {
            'content-type': contentType,
            ..._.config.header,
            ...config.header
        };

        const newConfig = {
            ...config,
            ..._.config,
            url,
            method,
            header
        }

        return newConfig;
    },

    // 请求拦截器
    interceptorsReq (config) {
        if (typeof _.interceptors.request === 'function') {
            let ret = _.interceptors.request(config);

            if (!ret) return false;
            config = ret;
        }

        return true;
    },

    // 响应拦截器
    interceptorsRep (res) {
        if (typeof _.interceptors.response === 'function') {
            let ret = _.interceptors.response(res);

            return ret ? ret : false;
        }

        return res;
    },

    // xhr数据回传成功
    xhrSuccess (res, config, canRetRep, resolve, reject) {
        let newRes = _.interceptorsRep(res);

        if (!!!newRes) {
            canRetRep.state = false;
            return false;
        }

        if (Object.prototype.toString.call(newRes) === '[object Promise]') {
            newRes.catch(config.fail || reject);

            return false;
        }

        config.success ? config.success(newRes) : resolve(newRes);
    },

    // xhr数据回传失败
    xhrFail (err, config, canRetRep, reject) {
        let newErr = _.interceptorsRep(err);

        if (!!!newErr) {
            canRetRep.state = false;
            return false;
        }

        config.fail ? config.fail(newErr) : reject(newErr)
    },

    // xhr数据回传成功或失败
    xhrComplete (res, config, canRetRep) {
        if (!config.complete || !canRetRep.state) return false;

        config.complete(res);
    },

    // 公共请求方法, 支持对象中callback或Promise
    request (config) {
        let canRetRep = { state: true };
        let example;
        let ret;

        if (!_.interceptorsReq(config)) return;

        ret = new Promise((resolve, reject) => {
            example = uni.request({
                ...config,

                success: res => {
                    _.xhrSuccess(res, config, canRetRep, resolve, reject);
                },
                fail: err => {
                    _.xhrFail(err, config, canRetRep, reject);
                },
                complete: res => {
                    _.xhrComplete(res, config, canRetRep);
                }
            })
        })

        /**
         * @todo 修改了__proto__(隐式原型)的属性
         */
        ret.__proto__.example = example;
        // ret.example = example;

        return ret;
    },

    // 抛出错误
    error (str) {
        throw ('[request error]: ' + str)
    }
}

export default new MyRequest();