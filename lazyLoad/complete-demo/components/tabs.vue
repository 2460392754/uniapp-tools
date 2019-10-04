<template>
    <view class='component nav'>
        <view class='tabs'>
            <view v-for="(val,i) of name"
                  :key="val"
                  :class="['tab',curIndex === i && 'active']"
                  @click="tabChange(i)">
                {{val}}
            </view>
        </view>

        <view class='content'>
            <slot></slot>
        </view>
    </view>
</template>

<script>
export default {
    props: {
        // tab 显示的标题
        name: {
            type: Array,
            default: () => []
        },

        // tab切换 回调函数
        change: {
            type: Function,
            default: () => { }
        }
    },

    data () {
        return {
            curIndex: 0
        }
    },

    methods: {
        tabChange (i) {
            this.curIndex = i;
            let that = this;

            // #ifdef MP-WEIXIN || APP-PLUS
            that = this.$parent;
            // #endif

            this.change.call(that, i)
        }
    }
}
</script>

<style>
.component.nav .tabs {
    display: flex;
    text-align: center;
}

.component.nav .tabs .tab {
    flex: 1;
    padding: 10px 0;
}

.component.nav .active {
    border-bottom: 2px solid #ccc;
}
</style>