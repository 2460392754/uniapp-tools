<template>
    <view>
        <v-print :res="res"
                 :err="err"></v-print>
    </view>
</template>

<script>
import VPrint from '../../components/print'
import Api from '../../api/test';

export default {
    data () {
        return {
            res: null,
            err: null
        }
    },

    methods: {
        $_getApiData () {
            Api.getMockDataMethodDownload().then(res => {
                console.log('is then', res)
                this.res = res;
            }).catch(err => {
                console.error('is catch', err)
                this.err = err;
            });
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