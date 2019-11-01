const $ = {};

/**
 * 类型判断
 * @param {String} type 值的类型
 * @param {Any} val 需要判断的值
 * @return {Boolean}
 */
$.isType = function(type, val) {
    return Object.prototype.toString.call(val) === `[object ${type}]`;
};

/**
 * 简单对象的深拷贝
 * @param {Array<Any>} args 参数列表
 * @return {Object<Any>}
 */
$.deepCopy = function(...args) {
    let res = {};

    args.forEach((arg) => {
        for (const key in arg) {
            res = assginValue(key, arg[key], res, $.deepCopy);
        }
    });

    return res;
};

const assginValue = function(key, val, container, callback) {
    const cTypeIsObj = $.isType('Object', container[key]);
    const vTypeIsObj = $.isType('Object', val);

    if (cTypeIsObj && vTypeIsObj) {
        container[key] = callback(container[key], val);
    } else if (vTypeIsObj) {
        container[key] = callback({}, val);
    } else {
        container[key] = val;
    }

    return container;
};

/**
 * 扩展对象的属性或方法
 * @param {Object} target 需要扩展的对象
 * @param {Object} obj 被拷贝对象
 * @param {Object} args 扩展函数继承的对象
 * @return {Object}
 */
$.extend = function(target, obj, args) {
    for (const key in obj) {
        const val = obj[key];

        if (args && $.isType('Function', val)) {
            target[key] = val.bind(args);
        } else {
            target[key] = val;
        }
    }

    return target;
};

/**
 * 获取完整的URL
 * @param {String|Undefined} baseURL 基地址
 * @param {String} requestURL 相对地址
 * @return {String}
 */
$.getFullURL = function(baseURL, requestURL) {
    if (baseURL && !isAbsoluteURL(requestURL)) {
        return composeURL(baseURL, requestURL);
    }

    return requestURL;
};

/**
 * 组合成绝对地址的 URL (基地址+相对地址)
 * @param {String} baseURL 基地址
 * @param {String} relativeURL 相对地址
 * @return {String}
 */
const composeURL = function(baseURL, relativeURL) {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
};

/**
 * 判断是否是绝对地址 (有 `://`或 `//` 就算是绝对地址)
 * @param {String} url
 * @return {Boolean}
 */
const isAbsoluteURL = function(url) {
    return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

/**
 * url添加params参数
 * @param {Object} o config
 * @param {String} o.url
 * @param {String} o.method
 * @param {Object} o.data
 * @param {Object} o.params
 * @return {String}
 */
$.paramsToURL = function({ url, method, data, params }) {
    let newParams = params;
    let newURL = url + (!~url.indexOf('?') ? '?' : '&');

    if (method.toLowerCase() === 'get') {
        newParams = data || params;
    }

    for (const [key, val] of Object.entries(newParams || {})) {
        newURL += `${key}=${val}&`;
    }

    return newURL.substring(0, newURL.length - 1);
};

/**
 * `content-type` 适配器
 * @param {Object} defaultHeader [{}]
 * @param {Object} instanceHeader [{}]
 * @param {Object} configHeader
 * @return {Object}
 */
$.adapterContentType = function(defaultHeader = {}, instanceHeader = {}, configHeader) {
    const LIST = ['content-type', 'Content-type', 'Content-Type', 'contentType', 'ContentType'];
    const newConfigHeader = $.deepCopy(configHeader);
    let val;

    for (const KEY of Object.keys(defaultHeader)) {
        if (LIST.includes(KEY)) {
            val = defaultHeader[KEY];
            delete newConfigHeader[KEY];
            break;
        }
    }

    for (const KEY of Object.keys(instanceHeader)) {
        if (LIST.includes(KEY)) {
            val = instanceHeader[KEY];
            delete newConfigHeader[KEY];
            break;
        }
    }

    val && (newConfigHeader['content-type'] = val);

    return newConfigHeader;
};

// 停止promise的链式操作
$.breakPromise = function() {
    return new Promise(() => {});
};

// 转换为 JSON 格式
$.toJSON = function(anyVal) {
    try {
        return JSON.parse(anyVal);
    } catch (e) {
        return anyVal;
    }
};

// 删除 url 上的参数
// $.delURLQueryString = function (url) {
//     return url.replace(/\?[\S|\s]+/, '');
// }

export default $;
