/*
 * @Description: 图片懒加载、预加载 v1.2.1
 * @Author: pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-06-12 18:47:15
 * @LastEditTime: 2019-08-01 10:25:28
 * @instruction: https://www.yuque.com/pocky/aaeyux/neg4m1
 * @github: https://github.com/2460392754/uniapp-tools/tree/master/lazyLoad
 * @dcloud https://ext.dcloud.net.cn/plugin?id=495
 */

class MyLazyLoad {
    // 初始化，获取并设置 scroll 标签的 height或width
    async init (scrollId, isHorizontal = false) {
        if (scrollId.indexOf('#') !== 0) {
            _.error("请填写scroll的样式id")
        }

        let { width, height } = await _.getScrollArgs(scrollId);

        if (isHorizontal) {
            _.scroll.w = width;
        } else {
            _.scroll.h = height;
        }

        _.setIsHorizontal(isHorizontal)
        _.loadImg();
    }

    // 获取全局变量
    getConfig () {
        return _.config;
    }

    // 设置全局变量
    setConfig (config) {
        _.config = {
            ..._.config,
            ...config
        }
    }

    // 监听滚动条2
    scroll () {
        _.loadImg();
    }

    // 添加 图片对象
    addImg (imgArgs) {
        _.loadImgArr.push(imgArgs)
    }

    // 清除
    destroy () {
        _.clearImg();
    }
}

var _ = {
    config: {
        // 图片加载错误替换的对象
        error: {},

        // 图片加载中替换的对象
        loading: {},

        // 预加载
        preLoadNum: 0,

        // 图片加载间隔(停顿)时间
        intervalTime: 0,

        // 最少过度动画时间
        minLoadAnimeTime: 0
    },

    // 当前scroll的width或者height
    scroll: {
        w: 0,
        h: 0,
    },

    // 是否横屏加载
    isHorizontal: false,

    // 需要加载的图片
    loadImgArr: [],

    setIsHorizontal (bool) {
        _.isHorizontal = bool;
    },

    // 获取 scroll-view 标签的数据
    getScrollArgs (id) {
        return _.getNodeList(id).then(res => {
            if (res.length === 0) {
                _.error("scroll样式id错误或未能获取当前属性");
            }

            // 原生scroll h5
            // #ifdef H5
            if (typeof res[0].tagName !== 'undefined') {
                let [{ clientWidth: width, clientHeight: height }] = res

                return { width, height };
            }
            // #endif

            let [{ width, height }] = res;

            return { width, height }

        }).catch(err => {
            _.error(err);
        })
    },

    // 清空 图片对象
    clearImg () {
        _.loadImgArr = [];
    },

    // 加载 图片对象
    async loadImg () {
        let pos = 0;

        for (const img of _.loadImgArr) {
            if (await _.loadImgIsComplete(img) === false) break;
            pos++;
        }

        _.removeImg(pos);
    },

    // 图片是否加载完成
    loadImgIsComplete (item) {
        return _.checkNeedLoadImgNode(item).then(item.fn).catch(() => false)
    },

    // 删除 图片对象
    removeImg (index) {
        _.loadImgArr.splice(0, index)
    },

    // 获取 nodeList 节点
    getNodeList (selector, that = null) {
        return new Promise(resolve => {
            let view = uni.createSelectorQuery();

            that && (view = view.in(that));
            view.selectAll(selector)
                .fields({
                    rect: true,
                    size: true,
                }, data => {
                    resolve(data);
                }).exec();
        });
    },

    // 检查需要加载图片的节点
    checkNeedLoadImgNode (item) {
        return new Promise((resolve, reject) => {
            _.getNodeList('#' + item.uuid, item.that).then(res => {
                if (res.length === 0) return;

                let [{ top, left }] = res;

                if ((!_.horizontal && top - _.config.preLoadNum <= _.scroll.h) ||
                    (_.horizontal && left - _.config.preLoadNum <= _.scroll.w)) {
                    return resolve()
                }

                reject();
            })
        })
    },

    // 抛出错误
    error (str) {
        throw ("[lazyLoad error]: " + str);
    }
}

// 挂载到全局->window对象（单例）(会造成全局污染，或者也可以挂载到vue的prototype)
if (!global.$lazyLoad) global.$lazyLoad = new MyLazyLoad()

export default global.$lazyLoad;