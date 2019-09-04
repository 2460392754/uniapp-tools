/*
 * @Description: uniapp request请求库 v1.3.7
 * @Author: pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-05-31 19:18:48
 * @LastEditTime: 2019-09-04 20:52:37
 * @instruction: https://www.yuque.com/pocky/aaeyux/pdik23
 * @github: https://github.com/2460392754/uniapp-tools/tree/master/request
 * @dcloud: https://ext.dcloud.net.cn/plugin?id=468
 */
class MyRequest {
    // 添加局部拦截器
    addInterceptors = {
        request: fn => {
            _.interceptors.request = fn;
        },
        response: fn => {
            _.interceptors.response = fn;
        }
    };

    /**
     * 添加全局拦截器
     * @param {Object} obj [{}] - 全局拦截器
     * @param {function} obj.request - 全局请求拦截器
     * @param {function} obj.response - 全局响应拦截器
     */
    addGlobalInterce ({ request, response } = {}) {
        _.interceptors.global.request = request
        _.interceptors.global.response = response
    }

    /**
     * 获取 全局配置
     */
    getConfig () {
        return _.config;
    }

    /**
     * 设置 全局配置
     * @param {Object} config - 配置数据
     */
    setConfig (config = {}) {
        const defaultConfig = {
            url: '',
            dataType: 'json',
            responseType: 'text'
        }

        _.config = _.merge.globalConfig(defaultConfig, config);
    }

    /**
     * get 请求
     * @param {Object} config - 局部配置数据
     * @return {Object|undefined} 
     */
    get (config) {
        const newConfig = _.merge.config(config, 'get');

        return _.request(newConfig);
    }

    /**
     * post 请求
     * @param {Object} config - 局部配置数据
     * @return {Object|undefined} 
     */
    post (config) {
        const newConfig = _.merge.config(config, 'post');

        return _.request(newConfig);
    }

    /**
     * put 请求
     * @param {Object} config - 局部配置数据
     * @return {Object|undefined} 
     */
    put (config) {
        const newConfig = _.merge.config(config, 'put');

        return _.request(newConfig);
    }

    /**
     * delete 请求
     * @param {Object} config - 局部配置数据
     * @return {Object|undefined} 
     */
    delete (config) {
        const newConfig = _.merge.config(config, 'delete');

        return _.request(newConfig);
    }

    /**
     * connect 请求
     * @param {Object} config - 局部配置数据
     * @return {Object|undefined} 
     */
    connect (config) {
        const newConfig = _.merge.config(config, 'connect');

        return _.request(newConfig);
    }

    /**
     * head 请求
     * @param {Object} config - 局部配置数据
     * @return {Object|undefined} 
     */
    head (config) {
        const newConfig = _.merge.config(config, 'head');

        return _.request(newConfig);
    }

    /**
     * trace 请求
     * @param {Object} config - 局部配置数据
     * @return {Object|undefined} 
     */
    trace (config) {
        const newConfig = _.merge.config(config, 'trace');

        return _.request(newConfig);
    }

    /**
     * options 请求
     * @param {Object} config - 局部配置数据
     * @return {Object|undefined} 
     */
    options (config) {
        const newConfig = _.merge.config(config, 'options');

        return _.request(newConfig);
    }

    /**
     * 停止发送请求
     * @param {Object} obj - request实例对象
     */
    stop (obj) {
        try {
            typeof obj.example.abort === 'function' && obj.example.abort();
        } catch (err) {
            _._error(`参数错误, 无法停止发送请求{errmsg: ${JOSN.stringify(err)}}`)
        }
    }
}

const _ = {
    // 全局配置
    config: {
        url: '',
        dataType: '',
        responseType: '',
        header: {},
        data: {},
        contentType: 'form',
    },

    // 拦截器
    interceptors: {
        request: null,
        response: null,
        global: {
            request: null,
            response: null,
        },

        /**
         * 请求拦截器(全局、局部)
         * @param {Object} config 
         * @param {number} count - 运行次数，用于递归的统计
         */
        req (config, count) {
            const type = (count === 1 ? '.global' : '') + '.request';
            const fnPath = "interceptors" + type;
            const fn = _.getObjPathVal(fnPath);

            if (typeof fn === 'function') {
                let ret = fn(config);

                if (ret === false || typeof ret === 'undefined') {
                    return false;
                }

                return count === 2 ? ret : _.interceptors.req(ret, 2);
            }

            if (count === 2) return config;
            return _.interceptors.req(config, 2);
        },

        /**
         * 响应拦截器(全局、局部)
         * @param {Object} res 
         * @param {number} count - 运行次数，用于递归的统计
         */
        rep (res, count) {
            const type = (count === 1 ? '.global' : '') + '.response';
            const fnPath = "interceptors" + type;
            const fn = _.getObjPathVal(fnPath);

            if (typeof fn === 'function') {
                let ret = fn(res);

                // 返回promise中reject的值
                if (Object.prototype.toString.call(ret) === '[object Promise]') {
                    return ret;
                }

                if (ret === false || typeof ret === 'undefined') {
                    return false;
                }

                return count === 2 ? ret : _.interceptors.rep(ret, 2);
            }

            if (count === 2) return res;
            return _.interceptors.rep(res, 2);
        }
    },

    // 合并
    merge: {
        /**
         * 合并 全局配置
         * @param {Object} defaultC - 默认配置
         * @param {Object} newC - 新配置
         */
        globalConfig (defaultC, newC) {
            return {
                ...defaultC,
                ...newC
            }
        },

        /**
         * 合并配置（全局配置+实例中的配置,实例中的优先级更高）
         * @param {Object} config 
         * @param {string} method 
         */
        config (config, method) {
            let url = _.merge.url(_.config.url, config.url);
            url += _.merge.params(config.params);

            const contentType = _.merge.contentType(_.config, config);
            const header = {
                'Content-type': contentType,
                ...config.header,
                ..._.config.header
            }
            const newConfig = {
                ...config,
                ..._.config,
                url,
                method,
                header
            };

            return newConfig;
        },

        /**
         * 合并url，返回完整的资源定位符
         * @param {string} beforeUrl - 全局配置中设置的基地址
         * @param {string} afterUrl - request实例中设置的url
         */
        url (beforeUrl, afterUrl) {
            const bLen = beforeUrl.length;
            const aLen = afterUrl.length;
            const beforeHasSlash = beforeUrl.lastIndexOf('/') + 1 === bLen;
            const afterHasSlash = afterUrl.indexOf('/') === 0;

            if (aLen === 0 || (bLen !== 0 && !_.isCompleteUrl(beforeUrl))) {
                _.error('url参数不完整或者错误');
            }

            if (_.isCompleteUrl(afterUrl)) {
                return afterUrl;
            }

            if (beforeHasSlash && afterHasSlash) {
                return beforeUrl + afterUrl.substr(1);
            }

            if (beforeHasSlash || afterHasSlash) {
                return beforeUrl + afterUrl;
            }

            if (!beforeHasSlash && !afterHasSlash) {
                return beforeUrl + '/' + afterUrl;
            }
        },

        /**
         * 合并header中content-type参数, 默认添加utf-8
         * @param {Object} config 
         * @param {Object} newConfig 
         * @return {String}
         */
        contentType (config, newConfig) {
            const defaultList = {
                form: 'application/x-www-form-urlencoded;charset=UTF-8',
                json: 'application/json;charset=UTF-8',
                file: 'multipart/form-data;charset=UTF-8'
            }
            const retObj = { val: false }

            f(newConfig, retObj)
            loop(newConfig, retObj);
            f(config, retObj)
            loop(config, retObj);

            function f (c, o) {
                const defaultKeys = Object.keys(defaultList);
                const type = c.contentType;

                if (o.val) return;

                if (typeof type !== 'undefined') {
                    !defaultKeys.includes(type) && _.error("contentType参数错误: " + type);
                }

                delete c.contentType

                o.val = defaultList[type];
            }

            function loop (c, o) {
                const hasList = ['content-type', 'content-Type', 'Content-Type', 'contentType', 'ContentType'];

                for (const [key, val] of Object.entries(c.header || {})) {
                    const pos = hasList.indexOf(key);

                    if (pos === -1) {
                        continue;
                    };

                    delete c.header[key];

                    if (!o.val) {
                        o.val = val;
                        break;
                    }
                }
            }

            return retObj.val || defaultList.form;
        },

        /**
         * 合并params，并转字符串
         * @param {Object} obj params对象
         * @return {String}
         */
        params (obj = {}) {
            if (obj === {}) return '';

            let tmpStr = '';

            for (const [key, val] of Object.entries(obj)) {
                tmpStr += `${key}=${val}&`;
            }

            tmpStr !== '' && (tmpStr = '?' + tmpStr);
            tmpStr = tmpStr.substring(0, tmpStr.length - 1)

            return tmpStr;
        }
    },

    xhr: {
        // 数据回传 成功
        success (res, config, canRetRep, resolve, reject) {
            const newRes = _.interceptors.rep(res, 1);
            const bool = _.xhr.commonIntercept(newRes, config, canRetRep, reject);

            if (bool === false) return false;
            config.success ? config.success(newRes) : resolve(newRes);
        },

        // 数据回传 失败
        fail (err, config, canRetRep, reject) {
            const newErr = _.interceptors.rep(err, 1);
            const bool = _.xhr.commonIntercept(newErr, config, canRetRep, reject);

            if (bool === false) return false;
            config.fail ? config.fail(newErr) : reject(newErr)
        },

        // 数据回传 完成
        complete (res, config, canRetRep) {
            if (!config.complete || !canRetRep.status) return false;

            config.complete(res);
        },

        // 公共拦截部分
        commonIntercept (obj, { fail }, type, reject) {
            // 数据被拦截, 没有返回值
            if (obj === false) {
                type.status = false;
                return false;
            }

            // 数据被拦截, 主动抛出错误
            if (Object.prototype.toString.call(obj) === '[object Promise]') {
                obj.catch(fail || reject);
                return false;
            }
        }
    },

    /**
     * 是否是完整的 url 
     * @param {string} url - 统一资源定位符
     */
    isCompleteUrl (url) {
        return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);
    },

    /**
     * 获取 根据对象的属性路径的值
     * @param {string} objPath - 对象的属性路径
     */
    getObjPathVal (objPath) {
        const splitList = objPath.split('.');
        let tmpObj = _;

        splitList.forEach(key => {
            tmpObj = tmpObj[key]
        });

        return tmpObj;
    },

    /**
     * 公共请求方法, 支持对象中callback或Promise
     * @param {Object} config - 完整的配置数据
     */
    request (config) {
        const canRetRep = { status: true };
        const newConfig = _.interceptors.req(config, 1);
        let example, ret;

        if (newConfig === false) return _.myPromise();

        ret = new Promise((resolve, reject) => {
            example = uni.request({
                ...newConfig,
                success: res => {
                    _.xhr.success(res, newConfig, canRetRep, resolve, reject);
                },
                fail: err => {
                    _.xhr.fail(err, newConfig, canRetRep, reject);
                },
                complete: res => {
                    _.xhr.complete(res, newConfig, canRetRep);
                }
            });
        });

        // @TODO: 隐式修改原型
        ret.__proto__.example = example;

        return ret;
    },

    myPromise () {
        let that = {};

        that.then = () => that;
        that.catch = () => that;
        that.finally = () => that;

        return that;
    },

    /**
     * 抛出错误
     * @param {string} msg 错误信息
     */
    error (msg) {
        throw new Error('[request error]: ' + msg)
    }
}

export default MyRequest;