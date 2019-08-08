/*
 * @Description: 模型生成库 v1.0.1
 * @Author: pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-08-03 ‏‎00:46:12
 * @LastEditTime: 2019-08-08 11:51:09
 * @instruction: https://www.yuque.com/pocky/aaeyux/yuh88a
 * @github: https://github.com/2460392754/uniapp-tools/tree/master/model
 * @dcloud: https://ext.dcloud.net.cn/plugin?id=655
 */

class MyModel {
    constructor(attributes) {
        _.attributes = attributes;
    }

    // 根据初始定义的模型，解析模型，进行变量映射赋值
    parse (data = {}) {
        for (const [key, item] of Object.entries(_.attributes)) {
            let path = item.property,
                itemVal = item.value,
                attributeVal = _.getObjPathVal(data, path),
                typeVal = _.getTypeDefaultVal(item.type);

            _.setParseAttrVal(key, attributeVal || itemVal || typeVal)
        }

        return _.getParseAttrVal();
    }

    // 根据初始定义的模型，反向映射数据
    traverse (data = {}) {
        let traverseAttr = {};

        for (const [key, item] of Object.entries(_.attributes)) {
            let path = item.property,
                dataVal = data[key],
                parseAttrVal = _.getParseAttrVal(key);

            _.setObjPathVal(traverseAttr, path, dataVal || parseAttrVal)
        }

        return traverseAttr;
    }
}

var _ = {
    attributes: {},
    parseAttr: {},

    // 获取 attributes 值
    getAttrVal (key) {
        return typeof key === 'undefined' ? _.attributes : _.attributes[key];
    },

    // 设置 attributes 值
    setAttrVal (key, val) {
        _.attributes[key] = val;
    },

    // 获取 parse attributes 值
    getParseAttrVal (key) {
        return typeof key === 'undefined' ? _.parseAttr : _.parseAttr[key];
    },

    // 设置 parse attributes 值
    setParseAttrVal (key, val) {
        _.parseAttr[key] = val;
    },

    // 获取 类型的默认值
    getTypeDefaultVal (type) {
        return type();
    },

    // 获取 对象属性路径的值
    getObjPathVal (data, path) {
        let objVal;

        _.getObjPathCallback(data, path, (obj, key, index, len) => {
            index == len && (objVal = obj[key])
        });

        return objVal;
    },

    // 设置 对象属性路径的值
    setObjPathVal (data, path, val) {
        _.getObjPathCallback(data, path, (obj, key, index, len) => {
            index === len && (obj[key] = val)
        });
    },

    // 根据对象的属性路径回调函数
    getObjPathCallback (obj, path, callback) {
        let count = 1;
        let tmpObj = obj;
        let splitArr = path.indexOf('.') !== -1 ? path.split('.') : [path];
        let len = splitArr.length;

        for (const key of splitArr) {
            callback && callback(tmpObj, key, count, len)
            tmpObj = typeof tmpObj[key] === 'undefined' ? tmpObj[key] = {} : tmpObj[key];
            count++;
        }
    }
}

export default MyModel;