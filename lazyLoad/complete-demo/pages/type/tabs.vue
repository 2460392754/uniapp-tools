<template>
    <view id="tabs-page">
        <tabs :name="name"
              :change="tabChange">
            <!-- tab-0 -->
            <view v-show="curIndex === 0">
                <scroll-view :id="name[0]"
                             scroll-y
                             @scroll="scroll">
                    <lazy-load v-for="uri of list[0]"
                               :key="uri"
                               :scroll-id="'#'+name[0]"
                               :src="uri"
                               mode="widthFix"></lazy-load>
                </scroll-view>
            </view>

            <!-- tab-1 -->
            <view v-show="curIndex === 1">
                <scroll-view :id="name[1]"
                             scroll-y
                             @scroll="scroll">
                    <lazy-load v-for="uri of list[1]"
                               :key="uri"
                               :scroll-id="'#'+name[1]"
                               :src="uri"
                               mode="widthFix"></lazy-load>
                </scroll-view>
            </view>
        </tabs>
    </view>
</template>

<script>
import lazyLoad from '../../components/lazyLoad/index';
import lazyLoadPlugin from '../../plugins/lazyLoad/js/index'
import Tabs from '../../components/tabs'

export default {
    data () {
        return {
            name: ['tab-0', 'tab-1'],
            list: [
                [
                    '/static/dog/x.jpg',
                    '/static/dog/1.jpg',
                    '/static/dog/2.jpg',
                    '/static/dog/3.jpg',
                    '/static/dog/4.jpg',
                    '/static/dog/5.jpg',
                    '/static/dog/6.jpg',
                    '/static/dog/xx.jpg',
                ],
                [
                    '/static/cat/x.jpg',
                    '/static/cat/1.jpg',
                    '/static/cat/2.jpg',
                    '/static/cat/3.jpg',
                    '/static/cat/xx.jpg',
                ]
            ],
            curIndex: 0
        }
    },

    methods: {
        scroll () {
            lazyLoadPlugin.scroll();
        },

        // tab change 事件
        tabChange (i) {
            this.curIndex = i;
            const id = this.$_getCurScrollId();

            lazyLoadPlugin.setScrollId(id)
        },

        // 获取当前 tab 的 scroll id
        $_getCurScrollId () {
            return '#' + this.name[this.curIndex];
        }
    },

    mounted () {
        lazyLoadPlugin.init({
            id: this.$_getCurScrollId()
        });
    },

    components: {
        lazyLoad,
        Tabs
    },

    destroyed () {
        lazyLoadPlugin.destroy();
    }
}
</script>

<style lang="scss">
#tabs-page {
    #tab-0,
    #tab-1 {
        background: #e8e8e8;
        height: 100vh;
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