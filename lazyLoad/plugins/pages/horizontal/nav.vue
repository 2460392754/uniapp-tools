<template>
    <view class='nav-page'>
        <v-nav :name="nav"
               :change="change">

            <!-- tab-0 -->
            <view v-show="cur === 0">
                <scroll-view :scroll-y="true"
                             @scroll="scroll"
                             id="scroll-0">
                    <view v-for="n of 6"
                          :key="n"
                          class='item'>
                        <v-lazyload scrollid="scroll-0"
                                    mode="widthFix"
                                    :src="'/static/dog/'+n+'.jpg'"></v-lazyload>
                    </view>
                </scroll-view>
            </view>

            <!-- tab-1 -->
            <view v-show="cur === 1">
                <scroll-view :scroll-y="true"
                             @scroll="scroll"
                             id="scroll-1">
                    <view v-for="n of 3"
                          :key="n"
                          class='item'>
                        <v-lazyload :src="'/static/cat/'+n+'.jpg'"
                                    scrollid="scroll-1"
                                    mode="widthFix"></v-lazyload>
                    </view>
                </scroll-view>
            </view>

        </v-nav>
    </view>
</template>

<script>
import VNav from '@/components/nav'
import VLazyload from "@/components/lazyLoad/index.vue";
import lazyLoadPlugin from '@/plugins/lazyLoad/js/lazyLoad.js'

export default {
    data () {
        return {
            nav: [
                'tab - 0',
                'tab - 1'
            ],
            cur: 0
        }
    },

    methods: {
        change (i) {
            // console.log('is change', i)
            this.cur = i;

            // 切换 scroll标签id
            lazyLoadPlugin.setScrollId('#scroll-' + i);
        },

        scroll () {
            lazyLoadPlugin.scroll();
        }
    },

    mounted () {
        /**
         * 初始化配置, scroll-view标签id
         * 第二个参数默认为false，横向懒加载，需要为 true
         * 当scroll被封装成自定义组件是，需要填写此组件的上下文
         */
        lazyLoadPlugin.init('#scroll-0', false)
        // lazyLoadPlugin.init('#scroll-0', false, { ctx: this })
    },

    destroyed () {
        // 监听页面卸载
        lazyLoadPlugin.destroy();
    },

    components: {
        VNav,
        VLazyload
    }
}
</script>

<style>
.nav-page {
    background: #f8f8f9;
}

#scroll-0,
#scroll-1 {
    height: 100vh; /* 需要给scroll-view设置高度 */
    background: #f8f8f9;
}

/* #ifdef H5*/
.nav-page >>> .img-lazyLoad .load-img {
    width: calc(100vw - 80px);
    height: 100px;
    border-radius: 10px;
}

.nav-page >>> .img-lazyLoad .load-error-img {
    width: 100px;
}
/* #endif */

/* #ifndef H5*/
.nav-page .img-lazyLoad .load-img {
    width: calc(100vw - 80px);
    height: 100px;
    border-radius: 10px;
}

.nav-page .img-lazyLoad .load-error-img {
    width: 100px;
}
/* #endif */

.nav-page .img-lazyLoad .load-error-img {
    width: 100px;
}

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