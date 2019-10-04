export default {
    loading: {  // 加载完成之前的替代图片或者动画组件
        type: 'component',
        name: 'loading-1'
    },
    // loading: {
    //     type: 'img',
    //     path: '/static/loading.png'
    // },
    // error: {  // 加载错误的替代图片
    //     type: 'img',
    //     path: '/static/error_1.png'
    // },
    error: {
        type: 'component',
        name: 'error-1'
    },

    // 预加载图片,单位 px
    preLoadNum: 100,

    // 图片加载间隔(停顿)时间，单位 ms
    intervalTime: 500,

    // 最少加载动画时间，单位 ms
    minLoadAnimeTime: 500,

    // scroll事件节流时间, 单位 ms
    throttleTime: 200,

    // 动画过度时间，单位 ms
    animeSwitchTime: 500,

    // 每次加载数量
    everyLoadQuantity: 2,

    // 开启调试打印
    debug: false
};