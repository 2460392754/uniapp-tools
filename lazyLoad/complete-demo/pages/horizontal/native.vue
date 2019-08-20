<template>
    <view class='native-y bg'>
        <view class='page'
              id="scroll">

            <view v-for="n of 6"
                  :key="n"
                  class='item'>
                <v-lazyload :src="'/static/dog/'+n+'.jpg'"
                            mode="widthFix"></v-lazyload>
            </view>
        </view>
    </view>
</template>

<script>
import lazyLoadPlugin from '@/plugins/lazyLoad/js/lazyLoad.js'
import VLazyload from "@/components/lazyLoad/index.vue";

export default {
    onPageScroll () {
        lazyLoadPlugin.scroll();
    },

    mounted () {
        lazyLoadPlugin.init('#scroll')
    },

    destroyed () {
        // 监听页面卸载
        lazyLoadPlugin.destroy();
    },

    components: {
        VLazyload,
    },
}
</script>

<style>
.native-y.bg {
    background: #f8f8f9;
}

#scroll {
    height: 100vh; /* 需要给scroll-view设置高度 */
}

/* #ifdef H5*/
.page >>> .img-lazyLoad .load-img {
    width: calc(100vw - 80px);
    height: 100px;
    border-radius: 10px;
}

.page >>> .img-lazyLoad .load-error-img {
    width: 100px;
}
/* #endif */

/* #ifndef H5*/
.page .img-lazyLoad .load-img {
    width: calc(100vw - 80px);
    height: 100px;
    border-radius: 10px;
}

.page .img-lazyLoad .load-error-img {
    width: 100px;
}
/* #endif */

.item {
    background: #fff;
    width: fit-content;
    padding: 20px;
    margin: 20px;
    border-radius: 10px;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    width: calc(100vw - 80px);
    /* min-height: 200px; */
}
</style>