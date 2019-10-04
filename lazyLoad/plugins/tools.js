import Config from './config';

const $ = Object.create(null);

/**
 * 事件节流
 * @param {number} delay 等待时间
 * @param {function} callback 回调函数
 * @return {function}
 */
$.throttle = function (delay, callback) {
    let flag = true;

    return function (...args) {
        if (!flag) return;

        flag = false;
        setTimeout(() => {
            callback.apply(this, args);
            flag = true;
        }, delay)
    }
}

/**
 * 获取 nodelist 节点的数据
 * @param {string} selector 选择器
 * @param {object} context 上下文，当前组件的引用
 * @return {Promise<resolve>}
 */
$.getNodeListData = function (selector, context) {
    return new Promise(resolve => {
        let view = uni.createSelectorQuery();

        context && (view = view.in(context));
        view.select(selector)
            .fields({
                rect: true,
                size: true,
                dataset: true
            }, resolve).exec();
    });
}

/**
 * 简单对象的深拷贝
 * @param {Array<Any>} args 参数列表
 * @return {Object<Any>}
 */
$.deepCopy = function (...args) {
    let res = {};

    args.forEach(arg => {
        for (const key in arg) {
            res = assginValue(key, arg[key], res, $.deepCopy);
        }
    });

    return res;
}

const assginValue = function (key, val, container, callback) {
    const cType = isType('Object', container[key]);
    const vType = isType('Object', val);

    if (cType && vType) {
        container[key] = callback(container[key], val);
    } else if (vType) {
        container[key] = callback({}, val);
    } else {
        container[key] = val;
    }

    return container;
}

/**
 * 类型判断
 * @param {string} type 
 * @param {any} any 
 * @return {boolean}
 */
const isType = function (type, any) {
    return Object.prototype.toString.call(any) === `[object ${type}]`;
}

/**
 * 错误处理
 * @param {string} msg 错误消息
 * @never
 */
$.errorHandler = function (msg) {
    throw ("[lazyLoad error]: " + msg);
}

/**
 * 调试 输出
 * @param {string} msg 信息
 * @param {number} code 输出状态code
 */
$.debug = function (msg, code) {
    if (!Config.debug) return;

    let style = 'font-weight:bold;';

    switch (code) {
        case 0: // error
            style += "color:#ed4014;"; break;
        case 1: // success
            style += 'color:#19be6b;'; break;
        case 2: // warn
            style += 'color:#ff9900;'; break;
        case 3: // info
            style += 'color:#2db7f5;'; break;
        default: // default
            console.log(msg); return;
    }

    console.log(`%c[lazyLoad]: ${msg}`, style)
}

/**
 * 获取 guid
 * https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
$.getGUID = function () {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

    return `guid-${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
}

export default $;