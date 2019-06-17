/*
 * @Description: 图片懒加载、预加载 v1.1.1
 * @Author: pocky
 * @Date: 2019-06-12 18:47:15
 * @LastEditTime: 2019-06-17 19:54:20
 * @instruction: https://www.yuque.com/docs/share/dca755d9-36e3-4312-8f7b-7e0b2579bc9b
 * @github: https://github.com/2460392754/uniapp-tools/tree/master/lazyLoad
 */
const LazyLoad = (function () {
    const globalConfig = {};
    const loadImgArr = [];

    let scrollHeight = 0;

    // 抛出错误
    function _error (str) {
        throw new Error("[lazyLoad error]: " + str)
    }

    // 加载 图片对象
    async function _loadImg () {
        if (loadImgArr.length === 0) return;

        let count = 0;

        for (let i = 0, len = loadImgArr.length; i < len; i++) {
            if (await _complete(loadImgArr[i]) === false) {
                break;
            } else {
                count++;
            }
        }

        _logoutImg(count);


        function _complete (item) {
            return _checkNeedloadImgNode(item).then(async () => {
                await item.fn();
            }).catch(() => {
                return false;
            });
        }
    }

    // 注销 图片对象
    function _logoutImg (len) {
        loadImgArr.splice(0, len)
    }

    // 获取 nodeList 节点
    function _getNodeList (selector, that = null) {
        return new Promise(resolve => {
            let view = uni.createSelectorQuery();

            that && (view = view.in(that));

            view
                .selectAll(selector)
                .fields({
                    rect: true,
                    size: true,
                }, data => {
                    resolve(data);
                }).exec();
        });
    }

    // 检查需要加载图片的节点
    function _checkNeedloadImgNode (item) {
        return new Promise((resolve, reject) => {
            _getNodeList("#" + item.uuid, item.that)
                .then(res => {
                    const [{ top }] = res;

                    top - globalConfig.preLoadHeight <= scrollHeight ? resolve() : reject();
                })
        })
    }

    return class {
        // 初始化，获取 scroll 标签的 height
        init (scrollId = "") {
            scrollId.indexOf("#") !== 0 && _error("请填写 scroll的样式id")

            _getNodeList(scrollId).then(res => {
                if (res.length === 0) {
                    _error("scroll样式id错误或未能获取当前属性")
                } else {
                    scrollHeight = res[0].height;

                    _loadImg();
                }
            });
        }

        // 获取全局变量
        getConfig () {
            return globalConfig;
        }

        // 设置全局变量
        setConfig (config = {}) {
            globalConfig.error = config.error || "";
            globalConfig.loading = config.loading || "";
            globalConfig.preLoadHeight = config.preLoadHeight || 0;
        }

        // 注册 图片对象
        registerImg (that, uuid, fn) {
            loadImgArr.push({
                that,
                uuid,
                fn
            });
        }

        // 监听滚动条
        scroll () {
            _loadImg();
        }
    }
})();

// 设置全局唯一
if (!global.$lazyLoad) global.$lazyLoad = new LazyLoad();

export default global.$lazyLoad;
