import Tools from '../tools'
import Subscribe from './subscribe'
import Node from './node';
import Config from '../config';
import DefaultData from '../default'

const node = new Node();
const subscribe = new Subscribe()

class App {
    constructor() {
        this._data = DefaultData;
        this._data.config = Tools.deepCopy(this._data.config, Config);
    }

    /**
     * 初始化
     * @param {object} o
     * @param {number} o.id scroll标签的选择器
     * @param {boolean} o.horizontal 是否是横排（x轴）滑动
     * @param {object} o.context 上下文，当前组件的引用
     */
    async init ({ id, horizontal = false, context }) {
        if (typeof id === 'undefined') {
            return Tools.errorHandler('请填写scroll的选择器');
        }

        let { width, height } = await node.getScrollLabelData(id, context);

        this._data.scroll.id = id;
        this._data.scroll.width = width
        this._data.scroll.height = height
        this._data.scroll.horizontal = horizontal
        load.call(this);
    }

    // 监听滚动条 + 节流
    scroll () {
        // console.log('scroll', this._data.scroll.status)

        if (!this._data.scroll.status) {
            return;
        }

        if (!this.scrollThrottle) {
            this.scrollThrottle = Tools.throttle(this._data.config.throttleTime, load)
        }

        this.scrollThrottle.call(this);
    }

    // 获取配置
    getConfig () {
        return this._data.config;
    }

    /**
     * 设置当前scroll标签的id, 并加载一次
     * @param {string} id 
     */
    setScrollId (id) {
        this._data.scroll.id = id;
        this.scroll();
    }

    /**
     * 订阅
     * @param {object} o
     * @param {string} o.id scroll id
     * @param {string} o.guid
     * @param {object} o.context
     * @param {function} o.fn
     */
    on ({ id, guid, context, fn }) {
        const { intervalTime: delay } = this.getConfig();

        subscribe.on({
            fn,
            guid,
            context,
            delay,
            name: id,
        });
    }

    // 卸载数据
    destroy (id) {
        subscribe.offAll(id || this._data.scroll.id);
    }
}

// 加载 图片对象
const load = async function () {
    const id = this._data.scroll.id;
    let list = [];

    subscribe.emit(id, async item => {
        let checkFuns = isLoadComplete.bind(this);

        // this._data.scroll.status = false;
        list.push({ checkFuns, item });

        //  达到 everyLoadQuantity 数量 或者 加载最后剩余的
        if (list.length === this._data.config.everyLoadQuantity ||
            list.length === subscribe.data[id].length) {
            Tools.debug('\n\n\n\n');
            Tools.debug('------------- 队列开始加载分割线 -------------', 3);

            this._data.scroll.status = false;
            let flag = await emit(id, list);
            this._data.scroll.status = true;

            list = [];
            flag === false && Tools.debug('当前队列存在 有无法加载的图片, 已停止 继续添加和加载队列', 0);

            return flag;
        }
    });
}

/**
 * 是否加载完成、结束
 * @param {object} item 订阅的数据引用
 * @return {Promise}
 */
const isLoadComplete = function (item) {
    const {
        scroll: {
            horizontal,
            width,
            height
        },
        config: { preLoadNum }
    } = this._data;
    const data = { horizontal, width, height, preLoadNum }

    return node.checkNeedLoad(item, data).then(item.fn);
}

/**
 * 发布
 * @param {string} id scroll标签的选择器
 * @param {array} list 需要发布的列表
 * @return {undefined|boolean}
 */
const emit = async function (id, list) {
    const len = list.length;
    let flag, msg, code;

    for (const index in list) {
        const valItem = list[index];
        const { guid } = valItem.item;


        // 需要等组件回调结束参数打印
        if (Number(index) === len - 1) { // 发布 最后一个组件, 需要用 async/await 模拟 阻塞线程
            await run();
        } else { // 直接用 Promise 模拟 异步加载
            run()
        }

        async function run () {
            await valItem.checkFuns(valItem.item).then(res => {
                off(id, valItem.item);
                msg = res;
                code = 1;
            }).catch(err => {
                flag = false;
                msg = err;
                code = 0;
            })

            Tools.debug(`
                emit ${code ? 'success' : 'error'}, 
                index: ${index}, 
                guid: ${guid},
                msg: ${msg}
            `, code);
        }
    }

    return flag;
}

/**
 * 退订
 * @param {string} id scroll标签的选择器
 * @param {object} item 订阅的数据引用
 */
const off = function (id, item) {
    subscribe.off(id, item);
}

export default App;