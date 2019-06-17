<template>
    <view>
        <scroll-view id="scroll"
                     :scroll-y="true"
                     @scroll="scroll">
            <v-lazyLoad src="/static/img1.jpg"
                        mode="widthFix"></v-lazyLoad>

            <v-lazyLoad src="/static/img2.jpg"
                        mode="widthFix"></v-lazyLoad>

            <v-lazyLoad src="/static/img3.jpg"
                        mode="widthFix"></v-lazyLoad>

            <v-lazyLoad src="/static/img4.jpg"
                        mode="widthFix"></v-lazyLoad>

            <v-lazyLoad src="/static/img5.jpg"
                        mode="widthFix"></v-lazyLoad>
        </scroll-view>
    </view>
</template>

<script>
import lazyLoad from "../../utils/lazyLoad"
import VLazyLoad from "../../components/lazyLoad"

export default {
    methods: {
        scroll (e) {
            lazyLoad.scroll(); // 监听滚动条事件
        }
    },

    mounted () {
        lazyLoad.init("#scroll"); // 填写scroll-view标签id，初始化插件
    },

    components: {
        VLazyLoad
    }
}
</script>

<style>
#scroll {
    height: 700px; // 需要给scroll-view设置高度
}
</style>
