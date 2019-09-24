<!--
 * @Description: uniapp formatToJSON v1.0.0
 * @Author: pocky
 * @Email 2460392754@qq.com
 * @Date: 2019-05-31 19:18:48
 * @LastEditTime: 2019-09-23 15:20:12
 * @instruction: https://www.yuque.com/pocky/aaeyux/adkd6g
 * @github: https://github.com/2460392754/uniapp-tools/tree/master/formatToJSON
 * @dcloud: https://ext.dcloud.net.cn/plugin?id=798
 -->
 
<template>
    <view class='v-component-print-json'>
        <print-template :node="node"></print-template>
    </view>
</template>

<script>
import PrintTemplate from './printTemplate';
import format from '../../plugins/formatToJSON/index'

export default {
    props: {
        value: {
            default: null
        }
    },

    data () {
        return {
            node: []
        }
    },

    created () {
        this.node = format(this.value);
    },

    components: {
        PrintTemplate
    },

    watch: {
        value (val) {
            this.node = format(val);
        }
    }
}
</script>

<style>
.v-component-print-json {
    background: #f8f8f9;
    padding: 20upx;
    color: #515a6e;
    overflow-x: auto;
    position: relative;
}
</style>