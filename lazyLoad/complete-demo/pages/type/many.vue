<template>
    <view id="many-page">
        <scroll-view :id="scrollId"
                     scroll-y
                     @scroll="scroll">

            <view class="container">
                <lazy-load v-for="url of list"
                           :key="url"
                           :src="url"
                           :scroll-id="'#'+scrollId"
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
            list: [
                "x",
                "/static/dog/1.jpg",
                "/static/dog/2.jpg",
                "/static/dog/3.jpg",
                "/static/dog/4.jpg",
                "/static/dog/5.jpg",
                "/static/dog/6.jpg",
                "xx",
                "/static/cat/1.jpg",
                "/static/cat/2.jpg",
                "/static/cat/3.jpg",
                "xxx",
            ]
        }
    },

    methods: {
        scroll () {
            lazyLoadPlugin.scroll();
        }
    },

    mounted () {
        lazyLoadPlugin.init({
            id: '#scroll'
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
#many-page {
    #scroll {
        background: #e8e8e8;
        height: 100vh;
    }

    .container {
        display: flex;
        flex-wrap: wrap;
        align-items: start;
    }

    /* #ifndef H5*/
    lazy-load {
        width: 50%;
    }
    /* #endif */

    .component-img-lazyload {
        box-shadow: 0 2upx 12upx rgba(0, 0, 0, 0.2);
        background: #fff;
        min-width: calc(50% - 160upx);
        min-height: 300upx;
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