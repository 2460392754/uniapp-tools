<template>
    <view id="index-page">
        <scroll-view :id="scrollId"
                     scroll-y
                     @scroll="scroll">

            <lazy-load v-for="val of list"
                       :key="val"
                       :scroll-id="'#'+scrollId"
                       :src="`/static/dog/${val}.jpg`"
                       mode="widthFix"></lazy-load>

        </scroll-view>
    </view>
</template>

<script>
import lazyLoad from '../../components/lazyLoad/index';
import lazyLoadPlugin from '../../plugins/lazyLoad/js/index'

export default {
    data () {
        return {
            scrollId: "scroll",
            list: ['x', '1', '2', '3', '4', '5', '6', 'xx']
        }
    },

    methods: {
        // 监听scroll事件
        scroll () {
            lazyLoadPlugin.scroll();
        }
    },

    mounted () {
        // 初始化插件，并加载一次首屏的组件，需要等lazyLoad组件加载完成后在初始化，例如从网络请求获取的图片列表
        lazyLoadPlugin.init({
            id: '#scroll',
        });
    },

    components: {
        lazyLoad
    },

    destroyed () {
        // 监听页面卸载
        lazyLoadPlugin.destroy();
    }
}
</script>

<style lang="scss">
#index-page {
    #scroll {
        background: #e8e8e8;
        height: 100vh; /* 需要给scroll-view设置高度 */
    }

    .component-img-lazyload {
        box-shadow: 0 2upx 12upx rgba(0, 0, 0, 0.2);
        background: #fff;
        min-height: 600upx;
        padding: 40upx;
        margin: 40upx;
        border-radius: 20upx;

        /* #ifdef H5*/
        /deep/ .img {
            width: 100%;
            border-radius: 14upx;
        }
        /* #endif */

        /* #ifndef H5*/
        .img {
            width: 100%;
            border-radius: 14upx;
        }
        /* #endif */
    }
}
</style>