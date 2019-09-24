<template>
    <view class='v-component-print'>
        <view v-if="!res && !err"
              class='title loading'>loading...</view>

        <text v-if="res"
              class='title success'>res:</text>
        <text v-else-if="err"
              class='title fail'>err:</text>

        <v-format-to-json :value="res || err"></v-format-to-json>
    </view>
</template>

<script>
import VFormatToJson from './formatToJSON/printJSON';

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
    },

    components: {
        VFormatToJson
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