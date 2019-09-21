<template>
    <view class='v-component-print'>
        <!-- response success result -->
        <view v-if='res'
              class='res'>
            <text class='title success'>res:</text>
            <view class='content'>{{toStr(res)}}</view>
        </view>

        <!-- response fail result -->
        <view v-else-if='err'
              class='err'>
            <text class='title fail'>err:</text>
            <view class='content'>{{toStr(err)}}</view>
        </view>

        <view v-else
              class='title loading'>loading...</view>
    </view>
</template>

<script>
export default {
    props: {
        res: {
            type: [Object, null],
            default: null
        },

        err: {
            type: [Object, null],
            default: null
        },
    },

    computed: {
        toStr () {
            return val => {
                return val === null ? null : JSON.stringify(val);
            }
        }
    }
}
</script>

<style lang="scss">
.v-component-print {
    .title {
        font-weight: bold;
        height: 40px;
        display: inline-block;
        line-height: 40px;
        margin-left: 10px;
    }

    .success {
        color: #19be6b;
    }

    .fail {
        color: #ed4014;
    }

    .loading {
        color: #2db7f5;
    }

    .content {
        color: #515a6e;
        background: #f8f8f9;
        padding: 20upx;
        word-break: break-word;
    }
}
</style>