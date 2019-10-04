<template>
    <view id="vertical-page">
        <scroll-view :id="scrollId"
                     scroll-x
                     @scroll="scroll">
            <view class='container'>
                <lazy-load v-for="val of list"
                           :key="val"
                           :scroll-id="'#'+scrollId"
                           :src="`/static/dog/${val}.jpg`"
                           mode="widthFix"></lazy-load>
            </view>
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
        scroll () {
            lazyLoadPlugin.scroll();
        }
    },

    mounted () {
        lazyLoadPlugin.init({
            id: '#scroll',
            horizontal: true
        });
    },

    components: {
        lazyLoad
    },

    destroyed () {
        lazyLoadPlugin.destroy();
    }
}
</script>

<style lang="scss">
#vertical-page {
    #scroll {
        background: #e8e8e8;
        height: 100vh;
    }

    .container {
        display: flex;
        flex-direction: row;
        align-items: start;
    }

    .component-img-lazyload {
        box-shadow: 0 2upx 12upx rgba(0, 0, 0, 0.2);
        background: #fff;
        min-height: 600upx;
        min-width: 600upx;
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