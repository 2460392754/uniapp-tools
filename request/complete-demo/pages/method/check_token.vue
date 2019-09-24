<template>
    <view>
        <v-print :res="res"
                 :err="err"></v-print>
    </view>
</template>

<script>
import VPrint from '../../components/print'
import Api from '../../api/token';

export default {
    data () {
        return {
            res: null,
            err: null
        }
    },

    methods: {
        $_getApiData () {
            Api.checkMockToken().then(res => {
                console.log('is then', res)
                this.res = res;
            }).catch(err => {
                console.error('is catch', err)
                this.err = err;
            }).finally(() => {
                // 还原数据
                this.$_delToken();
            })
        },

        // 删除 localStorage 中的 token
        $_delToken () {
            uni.setStorageSync('token', null);
        }
    },

    created () {
        this.$_getApiData();
    },

    components: {
        VPrint
    }
}
</script>

<style>
</style>