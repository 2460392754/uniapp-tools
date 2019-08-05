/*
 * @Description: 模型生成库 v1.0
 * @Author: pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-08-03 ‏‎00:46:12
 * @LastEditTime: 2019-08-05 10:16:10
 * @instruction: https://www.yuque.com/pocky/aaeyux/yuh88a
 * @github: https://github.com/2460392754/uniapp-tools/tree/master/model
 * @dcloud: 
 */

class Model {
    constructor(obj) {
        _.obj = { ...obj }
    }

    /**
     * @description: 根据初始定义的模型，解析模型，进行变量映射赋值
     * @param {Object} data 
     * @return {Object}
     */
    parse (data = {}) {
        for (const [key, item] of Object.entries(_.obj)) {
            let path = item.property,
                defaultVal = item.value,
                val = _.getObjectPathVal(data, path, defaultVal) || _.getDefaultValue(item.type);

            _.set(key, val);
        }

        return _.parseObj;
    }

    /**
     * @description: 根据初始定义的模型，反向映射数据
     * @param {Object} data 
     * @return {Object}
     */
    traverse (data = {}) {
        let tmpObj = {}

        for (const [key, item] of Object.entries(_.obj)) {
            let path = item.property,
                sourceVal = data[key];

            _.setObjectPathVal(tmpObj, path, sourceVal)
        }

        return tmpObj;
    }
}

var _ = {
    obj: {},
    parseObj: {},

    /**
     * @description: 设置值
     * @param {String} key 键值
     * @param {any} val 值
     */
    set (key, val) {
        _.parseObj[key] = val;
    },

    /**
     * @description: 获取默认值
     * @param {Object} type  
     * @return {*}
     */
    getDefaultValue (type) {
        return type();
    },

    /**
     * @description: 根据对象的属性路径获取值
     * @param {Object} obj 对象
     * @param {String} path 对象的属性路径
     * @param {*} defaultVal 默认值
     * @return {*}
     */
    getObjectPathVal (obj, path, defaultVal) {
        let arrPathStr = _.getPathStrToArr(path);

        try {
            return eval(`obj${arrPathStr}`) || defaultVal;
        } catch (e) {
            return defaultVal;
        }
    },

    /**
     * @description: 设置对象属性路径的值
     * @param {Object} obj 对象
     * @param {String} path 对象的属性路径
     * @param {*} newVal 值
     */
    setObjectPathVal (obj, path, newVal) {
        let arrPathStr = _.getPathStrToArr(path);

        // 对象初始化
        if (path.split('.').length > 1) {
            let tmpPath = '';

            for (let attribute of path.split('.')) {
                tmpPath += `['${attribute}']`;

                eval(`obj${tmpPath} = {}`);
            }
        }

        if (_.isType(newVal, 'String')) {
            eval(`obj${arrPathStr} ='${newVal}'`)
        }

        else if (_.isType(newVal, 'Object')) {
            eval(`obj${arrPathStr} = ${JSON.stringify(newVal)}`)
        }

        else {
            eval(`obj${arrPathStr} = ${newVal}`)
        }
    },

    /**
     * @description: 获取字符串转数组字符的路径
     * @param {String} path 对象的属性路径
     * @return {String}
     */
    getPathStrToArr (path) {
        let splitArr = path.split('.'),
            arrPathStr = '';

        for (const val of splitArr) {
            arrPathStr += `['${val}']`;
        }

        return arrPathStr;
    },

    /**
     * @description: 强类型判断
     * @param {*} any 值
     * @param {String} type 类型
     * @return {boolean} 
     */
    isType (any, type) {
        return Object.prototype.toString.call(any) === `[object ${type}]`
    }
}

export default Model;