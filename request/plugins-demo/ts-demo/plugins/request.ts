/*
 * @Description: uniapp request请求库 v1.2.2
 * @Author pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-05-31 19:18:48
 * @LastEditTime: 2019-08-06 16:07:39
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
class MyRequest implements actionIFS {
    addInterceptors: interceptorsIFS;

    private _config: globalConfigIFS;
    private _interceptors: interceptorsIFS;

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
    getConfig(): globalConfigIFS {
        return this._config;
    }

    // 设置全局配置
    setConfig(config: setConfigIFS = {}): void {
        const defaultConfig: setConfigIFS = {
            url: '',
            dataType: 'json',
            responseType: 'text'
        }

        this._config = {
            ...defaultConfig,
            ...config
        }
    }

    // 停止发送请求
    stop(obj: any): void | never {
        try {
            if (obj.example.abort && typeof obj.example.abort === 'function') {
                obj.example.abort();
            }
        } catch (err) {
            this._error('参数错误, 无法停止发送请求')
        }
    }

    // get请求
    // get<T>(config: globalConfigIFS): Object | boolean | Promise<T> {
    get<T>(config: globalConfigIFS): any {
        const newConfig = this._mergeConfig(config, 'get');

        return this._request(newConfig);
    }

    // post请求
    // post<T>(config: globalConfigIFS): Object | boolean | Promise<T> {
    post<T>(config: globalConfigIFS): any {
        const newConfig = this._mergeConfig(config, 'post');

        return this._request(newConfig);
    }

    // 合并url，返回完整的资源定位符
    private _mergeUrl(url: string): string | never {
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

        if (!beforeUrlHasSlash && !afterUrlHasSlash) {
            return configUrl + '/' + url;
        }
    }

    // 是否是完整的 url 
    private _isCompleteUrl(url: string): boolean {
        return /(http|https):\/\/([\w.]+\/?)\S*/.test(url);
    }

    // 合并header中content-type参数, 默认添加utf-8
    private _mergeContentType(type: string = 'form'): string | never {
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
                this._error("contentType参数错误");
        }

        return tmpStr + ";charset=UTF-8";
    }

    // 合并配置（全局配置+实例中的配置, 实例中的优先级更高）
    private _mergeConfig(config: globalConfigIFS, method: string): Object {
        const url: string = this._mergeUrl(config.url);
        const contentType: string = this._mergeContentType(config.contentType || this._config.contentType);

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
    private _interceptorsRep<T>(res: Object): Object | boolean | Promise<T> {
        if (typeof this._interceptors.response === 'function') {
            let ret = this._interceptors.response(res);

            return ret ? ret : false;
        }

        return res;
    }

    // xhr数据回传成功
    private _xhrSuccess(res: Object, config: globalConfigIFS, canRetRep: Object | any, resolve: Function, reject: Function) {
        let newRes = this._interceptorsRep(res);

        if (!!!newRes) {
            canRetRep.state = false;
            return false;
        }

        // 给 callback 回调方法添加捕获错误方法
        if (Object.prototype.toString.call(newRes) === '[object Promise]') {
            // config.fail && (newRes as any).catch(config.fail)
            // config.fail && newRes.catch(config.fail)
            (newRes as any).catch(config.fail || reject);

            return false;
        }

        config.success ? config.success(newRes) : resolve(newRes);
    }

    // xhr数据回传失败
    private _xhrFail(err: Object, config: globalConfigIFS, canRetRep: Object | any, reject: Function) {
        let newErr = this._interceptorsRep(err);

        if (!!!newErr) {
            canRetRep.state = false;
            return false;
        }

        config.fail ? config.fail(newErr) : reject(newErr)
    }

    // xhr数据回传成功或失败
    private _xhrComplete(res: Object, config: globalConfigIFS, canRetRep: Object | any) {
        if (!config.complete || !canRetRep.state) return false;

        config.complete(res);
    }

    // 公共请求方法, 支持对象中callback或Promise
    private _request(config: any | Object): Object | undefined {
        let canRetRep: Object = { state: true },
            example: Object,
            ret: Object;

        if (!this._interceptorsReq(config)) return;

        ret = new Promise<Object>((resolve, reject) => {
            // @ts-ignore
            example = uni.request({
                ...config,

                success: (res: Object) => {
                    this._xhrSuccess(res, config, canRetRep, resolve, reject)
                },
                fail: (err: Object): void | boolean => {
                    this._xhrFail(err, config, canRetRep, reject)
                },
                complete: (res: Object): void | boolean => {
                    this._xhrComplete(res, config, canRetRep)
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
        throw ('[request error]: ' + str);
    }
}

export default new MyRequest();