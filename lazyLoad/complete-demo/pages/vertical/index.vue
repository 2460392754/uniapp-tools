<template>
    <view>
        <scroll-view scroll-x="true"
                     scroll-left="120"
                     @scroll="scroll"
                     id="scroll"
                     class="vertical">
            <view class='container'>
                <!-- not exists img -->
                <view class='item'>
                    <v-lazyload :src="'/static/dog/1123123.jpg'"
                                mode="widthFix"></v-lazyload>
                </view>

                <view v-for="n of 6"
                      :key="n"
                      class='item'>
                    <v-lazyload :src="'/static/dog/'+n+'.jpg'"
                                mode="widthFix"></v-lazyload>
                </view>

                <!-- not exists img -->
                <view class='item'>
                    <v-lazyload :src="'/static/dog/11231xasxasx23.jpg'"
                                mode="widthFix"></v-lazyload>
                </view>
            </view>
        </scroll-view>
    </view>
</template>

<script>
import VLazyload from "@/components/lazyLoad/index.vue";
import lazyLoadPlugin from '@/plugins/lazyLoad/js/lazyLoad.js'

export default {
    methods: {
        scroll () {
            // 监听scroll事件
            lazyLoadPlugin.scroll();
        }
    },

    components: {
        VLazyload,
    },

    mounted () {
        // 初始化配置, scroll-view标签id, 第二个参数默认为false，横向懒加载，需要为 true
        lazyLoadPlugin.init('#scroll', true)
    },

    destroyed () {
        // 监听页面卸载
        lazyLoadPlugin.destroy();
    }
}
</script>

<style>
#scroll {
    width: 100%; /* 需要给scroll-view设置宽度 */
    background: #f8f8f9;
}

#scroll .container {
    display: flex;
    flex-direction: row;
}

/* #ifdef H5*/
#scroll >>> .img-lazyLoad .load-img {
    width: calc(100vw - 80px);
    height: 100px;
    border-radius: 10px;
}
/* #endif */

/* #ifndef H5*/
#scroll .img-lazyLoad .load-img {
    width: calc(100vw - 80px);
    height: 100px;
    border-radius: 10px;
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
