export default {
    // 配置文件
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
        minLoadAnimeTime: 0,

        // 过度动画时间
        animeSwitchTime: 500,

        // 节流时间
        throttleTime: 0,

        // 每次加载数量
        everyLoadQuantity: 1,

        // 开启调试
        debug: false
    },

    // scroll数据
    scroll: {
        // scroll label id 
        id: null,

        // scroll label style width
        width: 0,

        // scroll label style height
        height: 0,

        // 是否 横屏加载
        horizontal: false,

        // 能否 加载
        status: true
    },
}