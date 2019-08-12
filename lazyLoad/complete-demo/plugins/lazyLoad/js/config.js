import lazyLoad from './lazyLoad'

lazyLoad.setConfig({
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
    preLoadNum: 0, // 预加载图片,单位 px
    intervalTime: 500, // 图片加载间隔(停顿)时间，单位 ms
    minLoadAnimeTime: 500, // 最少过度动画时间，单位 ms
})