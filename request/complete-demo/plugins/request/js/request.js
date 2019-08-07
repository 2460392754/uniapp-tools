/*
 * @Description: uniapp request请求库 v1.3
 * @Author pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-05-31 19:18:48
 * @LastEditTime: 2019-08-07 16:43:36
 * @instruction https://www.yuque.com/pocky/aaeyux/pdik23
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

    // 添加全局拦截器
    addGlobalInterce ({ request, response } = {}) {
        _.interceptors.global.request = request
        _.interceptors.global.response = response
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
        response: null,
        global: {
            request: null,
            response: null,
        }
    },

    // 合并url，返回完整的资源定位符
    mergeUrl (url) {
        const configUrl = _.config.url;
        const beforeUrlHasSlash = configUrl.lastIndexOf('/') + 1 === configUrl.length;
        const afterUrlHasSlash = url.indexOf('/') === 0;

        if (url.length === 0 || (configUrl.length !== 0 && !_.isCompleteUrl(configUrl))) {
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
            ...config.header,
            ..._.config.header,
        };

        const newConfig = {
            ...config,
            ..._.config,
            url,
            method,
            header
        }

        delete newConfig.contentType

        return newConfig;
    },

    // 请求拦截器
    interceptorsReq (config, n = 0) {
        let type = '.request';
        let fnName = `interceptors${n === 1 ? ".global" + type : type}`;
        let fn = _.getinterceptorsFn(fnName)

        if (typeof fn === 'function') {
            let ret = fn(config);

            if (ret === false || typeof ret === 'undefined') {
                return false;
            }

            return n === 0 ? ret : _.interceptorsReq(ret)
        }

        if (n === 0) return config;
        return _.interceptorsReq(config);
    },

    // 响应拦截器
    interceptorsRep (res, n = 0) {
        let type = `.response`;
        let fnName = `interceptors${n === 1 ? ".global" + type : type}`;
        let fn = _.getinterceptorsFn(fnName)

        if (typeof fn === 'function') {
            let ret = fn(res);

            // 返回promise中reject的值
            if (Object.prototype.toString.call(ret) === '[object Promise]') {
                return ret;
            }

            if (ret === false || typeof ret === 'undefined') {
                return false;
            }

            return n === 0 ? ret : _.interceptorsRep(ret);
        }

        if (n === 0) return res;
        return _.interceptorsReq(res);
    },

    // 获取拦截器的函数
    getinterceptorsFn (fnName) {
        let splitArr = fnName.split('.');
        let tmpObj = _;

        for (let name of splitArr) {
            tmpObj = tmpObj[name];
        }

        return tmpObj;
    },

    // xhr数据回传成功
    xhrSuccess (res, config, canRetRep, resolve, reject) {
        let newRes = _.interceptorsRep(res, 1);

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
        let newErr = _.interceptorsRep(err, 1);

        if (!!!newErr) {
            canRetRep.state = false;
            return false;
        }

        if (Object.prototype.toString.call(newErr) === '[object Promise]') {
            newErr.catch(config.fail || reject);

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

        config = _.interceptorsReq(config, 1);
        if (config === false) return;

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

export default MyRequest;