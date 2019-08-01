/*
 * @Description: 图片懒加载、预加载 v1.2
 * @Author: pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-06-12 18:47:15
 * @LastEditTime: 2019-08-01 10:25:28
 * @instruction: https://www.yuque.com/pocky/aaeyux/neg4m1
 * @github: https://github.com/2460392754/uniapp-tools/tree/master/lazyLoad
 * @dcloud https://ext.dcloud.net.cn/plugin?id=495
 */

class LazyLoad {
    /**
     * 初始化，获取并设置 scroll 标签的 height或width
     * @param {string} scrollId scroll样式id
     * @param {boolean} isHorizontal 横屏显示
     */
    init (scrollId, isHorizontal = false) {

        if (scrollId.indexOf('#') !== 0) {
            _.error("请填写scroll的样式id")
        }

        if (typeof isHorizontal !== 'boolean') {
            _.error("isHorizontal type is boolean")
        }

        _.horizontal = isHorizontal;

        _.getNodeList(scrollId).then(res => {
            if (res.length === 0) {
                _.error("scroll样式id错误或未能获取当前属性");
            }

            let { width, height } = res[0];

            _.horizontal ? (_.scroll.w = width) : (_.scroll.h = height)
            _.loadImg();
        }).catch()
    }

    // 获取全局变量
    getConfig () {
        return _.config;
    }

    // 设置全局变量
    setConfig (config = {}) {
        if (!_.checkConfig(config)) return;

        _.config = {
            ..._.config,
            ...config
        }
    }

    // 添加 图片对象
    addImg ({ that, uuid, fn }) {
        _.loadImgArr.push({ that, uuid, fn })
    }

    // 监听滚动条
    scroll () {
        _.loadImg();
    }

    // 卸载并清除
    destroy () {
        _.clearImg();
    }
}

var _ = {
    config: {
        error: {},
        loading: {},
        preLoadNum: 0,
        intervalTime: 0,
        minLoadAnimeTime: 0
    },
    scroll: {
        w: 0,
        h: 0
    },
    horizontal: false,
    loadImgArr: [],

    // 清空 图片对象
    clearImg () {
        _.loadImgArr = [];
    },

    // 验证配置
    checkConfig (config) {
        let type = [
            { 'Object': ['error', 'loading'] },
            { 'Number': ['preLoadNum', 'intervalTime', 'minLoadAnimeTime'] }
        ]

        // check type
        outer: for (const item of type) {
            for (const [key, arr] of Object.entries(item)) {
                for (const name of arr) {
                    const type = Object.prototype.toString.call(config[name]);

                    if (type !== `[object ${key}]`) {
                        _.error(`'setConfig' type check failed for '${name}'.Expected [object ${key}],got ${type}`)
                        break outer;
                    }
                }
            }
        }

        return true;
    },

    // 加载 图片对象
    loadImg: async function () {
        if (_.loadImgArr.length === 0) return;
        let pos = 0;

        for (let i = 0, len = _.loadImgArr.length; i < len; i++) {
            if (await _.loadImgIsComplete(_.loadImgArr[i]) === false) break;
            pos++;
        }

        _.removeImg(pos);
    },

    // 图片已经加载完成
    loadImgIsComplete: function (item) {
        return _.checkNeedLoadImgNode(item)
            .then(item.fn)
            .catch(() => false)
    },

    // 删除 图片对象
    removeImg: function (pos) {
        _.loadImgArr.splice(0, pos)
    },

    // 获取 nodeList 节点
    getNodeList: function (selector, that = null) {
        return new Promise(resolve => {
            let view = uni.createSelectorQuery();

            that && (view = view.in(that));
            view.selectAll(selector)
                .fields({
                    rect: true,
                    size: true,
                    dataset: true
                }, data => {
                    resolve(data);
                }).exec();
        });
    },

    // 检查需要加载图片的节点
    checkNeedLoadImgNode: function (item) {
        return new Promise((resolve, reject) => {
            _.getNodeList('#' + item.uuid, item.that).then(res => {
                if (res.length === 0) return;

                let [{ top, left }] = res;

                if ((_.horizontal === false && top - _.config.preLoadNum <= _.scroll.h) ||
                    (_.horizontal === true && left - _.config.preLoadNum <= _.scroll.w)) {
                    return resolve()
                }

                reject();
            })
        })
    },

    // 抛出错误
    error: function (str) {
        throw new Error("[lazyLoad error]: " + str)
    },
}

// 挂载到全局（单例）
if (!global.$lazyLoad) global.$lazyLoad = new LazyLoad()

export default global.$lazyLoad;