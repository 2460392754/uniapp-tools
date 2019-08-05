/*
 * @Description: uniapp request请求库 v1.2.1
 * @Author pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-05-31 19:18:48
 * @LastEditTime: 2019-08-05 12:44:41
 * @instruction https://www.yuque.com/pocky/aaeyux/xwgrav
 * @github https://github.com/2460392754/uniapp-tools/tree/master/request
 * @dcloud https://ext.dcloud.net.cn/plugin?id=468
 */

// 全局方法 
interface actionIFS {
    getConfig: Function,
    setConfig: Function,

    stop: Function,
    get: Function,
    post: Function,
}

// 拦截器
interface interceptorsIFS {
    request: Function | null,
    response: Function | null
}

// 设置参数
interface setConfigIFS {
    url?: string,
    dataType?: string,
    responseType?: string,
    header?: Object,
    contentType?: string,
}

// 全局参数
interface globalConfigIFS extends setConfigIFS {
    header?: Object,
    data?: Object,
    success?: Function,
    fail?: Function,
    complete?: Function
}

// 请求类
class Request implements actionIFS {
    private _config: globalConfigIFS;
    private _interceptors: interceptorsIFS;
    addInterceptors: interceptorsIFS;

    constructor() {
        this._config = {
            url: '',
            dataType: '',
            responseType: '',
            header: {},
            data: {},
        }

        this._interceptors = {
            request: null,
            response: null
        }

        this.addInterceptors = {
            request: fn => {
                this._interceptors.request = fn;
            },
            response: fn => {
                this._interceptors.response = fn;
            }
        }
    }

    // 获取全局配置
    getConfig(): Object {
        return this._config;
    }

    // 设置全局配置
    setConfig(config: setConfigIFS = {}): void {
        let defaultConfig: setConfigIFS = {
            url: '',
            dataType: 'json',
            responseType: 'text'
        }
        let newConfig = (Object as any).assign(defaultConfig, config);

        this._config = newConfig;
    }

    // get请求
    // get(config: globalConfigIFS): Object | boolean | Promise {
    get(config: globalConfigIFS): any {
        const newConfig = this._mergeConfig(config, 'get');

        return this._request(newConfig);
    }

    // post请求
    // post(config: globalConfigIFS): Object | boolean| Promise  {
    post(config: globalConfigIFS): any {
        const newConfig = this._mergeConfig(config, 'post');

        return this._request(newConfig);
    }

    // 停止发送请求
    // stop({ example = undefined as Object }): void | never {
    stop(obj: any): void | never {
        if (obj && obj.example && obj.example.abort) {
            obj.example.abort();
        } else {
            this._error('参数错误, 无法停止发送请求');
        }
    }

    // 拼接 url，返回完整的资源定位符(url)
    private _joinUrl(url: string): string | never {
        const configUrl = this._config.url;
        const beforeUrlHasSlash: boolean = configUrl.lastIndexOf('/') + 1 === configUrl.length;
        const afterUrlHasSlash: boolean = url.indexOf('/') === 0;

        if (url.length === 0 || !this._isCompleteUrl(configUrl)) {
            this._error('url参数不完整或者错误');
        }

        if (this._isCompleteUrl(url)) {
            return url;
        }

        if (beforeUrlHasSlash && afterUrlHasSlash) {
            return configUrl + url.substr(1);
        }

        if (beforeUrlHasSlash || afterUrlHasSlash) {
            return configUrl + url;
        }

        // !beforeUrlHasSlash && !afterUrlHasSlash
        return configUrl + '/' + url;
    }

    // 是否是完整的 url 
    private _isCompleteUrl(url: string): boolean {
        return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);
    }

    // 合并header中content-type参数,默认添加utf-8
    private _mergeContentType(type: string = 'form'): string {
        let str = "";

        if (type === "form" || typeof type === "undefined") {
            str = 'application/x-www-form-urlencoded';
        } else if (type === "json") {
            str = 'application/json';
        } else if (type === "file") {
            str = 'multipart/form-data';
        } else {
            this._error("contentType参数错误");
        }

        str += ";charset=UTF-8";

        return str;
    }

    // 合并配置（全局配置+实例中的配置,实例中的优先级更高）
    private _mergeConfig(config: globalConfigIFS, method: string): Object {
        const url: string = this._joinUrl(config.url);
        const contentType = this._mergeContentType(config.contentType || this._config.contentType);
        const header: Object = {
            'content-type': contentType,
            ...this._config.header,
            ...config.header,
        }

        const newConfig = {
            ...config,
            ...this._config,
            url,
            method,
            header,
        }

        return newConfig;
    }

    // 请求拦截器
    private _interceptorsReq(config: Object): boolean {
        if (typeof this._interceptors.request === 'function') {
            let ret = this._interceptors.request(config);

            if (!ret) return false;
            config = ret;
        }

        return true;
    }

    // 响应拦截器
    // private _interceptorsRep(res: Object): Object | boolean | Promise {
    private _interceptorsRep(res: Object): any {
        if (typeof this._interceptors.response === 'function') {
            let ret = this._interceptors.response(res);

            return ret ? ret : false;
        }

        return res;
    }

    // 公共请求方法, 支持对象中callback或Promise
    private _request(config: any | Object): Object | undefined {
        let canRetRep: boolean = true,
            example: Object,
            ret: Object;

        if (!this._interceptorsReq(config)) return;

        ret = new Promise((resolve, reject) => {
            // @ts-ignore
            example = uni.request({
                ...config,

                // success:  (res: Object): void | boolean => {
                success: (res: Object) => {
                    let newRes = this._interceptorsRep(res);

                    if (!!!newRes) {
                        canRetRep = false;
                        return false;
                    }

                    // 给 callback 回调方法添加捕获错误方法
                    if (Object.prototype.toString.call(newRes) === '[object Promise]') {
                        config.fail && newRes.catch(config.fail)
                        return false;
                    }

                    config.success ? config.success(newRes) : resolve(newRes);
                },
                fail: (err: Object): void | boolean => {
                    let newErr = this._interceptorsRep(err);

                    if (!!!newErr) {
                        canRetRep = false;
                        return false;
                    }

                    config.fail ? config.fail(newErr) : reject(newErr)
                },
                complete: (res: Object): void | boolean => {
                    if (!config.complete || !canRetRep) return false;

                    config.complete(res);
                }
            });
        });

        /**
         * @todo 修改了__proto__(隐式原型)的属性
         */
        (ret as any).__proto__.example = example;
        // (ret as any).example = example;

        return ret;
    }

    // 抛出错误
    private _error(str: string): never {
        throw new Error('[request error]: ' + str);
    }
}

export default new Request();