import Interceptors from './interceptor';
import MergeConfig from './mergeConfig';
import Tools from '../tools';
import * as Network from './network';
import { globalInterceptor, config } from '../config';

function MyRequest() {
    this.defaultConfig = config;
    this.interceptors = {
        scoped: {
            request: new Interceptors(),
            response: new Interceptors()
        },
        global: globalInterceptor
    };
}

/**
 * 通用请求
 * 支持请求格式 `request('example/url'[, config])`
 * @param {Object} config [{}] 配置信息
 */
MyRequest.prototype.request = function(config = {}) {
    if (typeof config === 'string') {
        config = arguments[1] || {};
        config.url = arguments[0];
    }

    // 设置默认 config.method
    if (!config.method && !this.defaultConfig.method) {
        config.method = 'get';
    }

    let method = (config.method = config.method.toLowerCase());
    let newConfig = MergeConfig(this.defaultConfig, config);
    let networkType = ['upload', 'download'].includes(method) ? method : 'xhr';

    const chain = [];
    let promise = Promise.resolve(newConfig);

    this.interceptors.global.request.forEach((interceptor) => {
        chain.push({ then: interceptor.fulfilled }, { catch: interceptor.rejected });
    });

    this.interceptors.scoped.request.forEach((interceptor) => {
        chain.push({ then: interceptor.fulfilled }, { catch: interceptor.rejected });
    });

    chain.push({ then: Network[networkType] });

    this.interceptors.global.response.forEach((interceptor) => {
        chain.push({ then: interceptor.fulfilled }, { catch: interceptor.rejected });
    });

    this.interceptors.scoped.response.forEach((interceptor) => {
        chain.push({ then: interceptor.fulfilled }, { catch: interceptor.rejected });
    });

    /**
     * 链式合并
     * 合并顺序格式
     * 没有就会跳过
     *
     * ``` javascript
     * Promise.resolve()
     * .then(global_Request)
     * .catch(global_Request)
     * .then(scoped_Request)
     * .catch(scoped_Request)
     * .then(发送请求)
     * .catch(请求错误、超时) // 好像会自动抛出
     * .then(global_Response)
     * .catch(global_Response)
     * .then(scoped_Response)
     * .catch(scoped_Response)
     * .then(获取请求的返回值)
     * .catch(拦截异常的返回值)
     * ```
     */
    chain.forEach((item) => {
        const [[type, fn]] = Object.entries(item);

        if (typeof fn !== 'function') {
            return true;
        }

        promise = promise[type]((obj) => {
            const interceptorConfig = MergeConfig(this.defaultConfig, config);

            let ret = fn(obj, interceptorConfig);

            // return false 就会跳出promise的链式函数
            if (ret === false) {
                return Tools.breakPromise();
            }

            // return config(Object类型) 或 return Promise.reject('xx') 才会继续发送请求或回传数据
            if (Tools.isType('Object', ret) || Tools.isType('Promise', ret)) {
                return ret;
            }
        });
    });

    return promise;
};

// 在 MyRequest 的原型上添加其他方法
[
    'get',
    'post',
    'put',
    'delete',
    'connect',
    'head',
    'options',
    'trace',
    'upload',
    'download'
].forEach((method) => {
    MyRequest.prototype[method] = function(url, config = {}) {
        const newConfig = Tools.deepCopy(config, {
            url,
            method
        });

        return this.request(newConfig);
    };
});

// 中断 发送中的请求
MyRequest.prototype.abort = function(instance) {
    try {
        instance.example.abort();
    } catch (e) {}
};

export default MyRequest;
