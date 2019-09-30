<template>
    <view>
        <button type="primary"
                @click="uploadFile">start upload file</button>

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
        uploadFile () {
            uni.chooseImage({
                count: 1,
                success: res => {
                    const { tempFilePaths } = res;

                    this.$_getApiData(tempFilePaths[0])
                }
            })
        },

        $_getApiData (path) {
            Api.getMockDataMethodUpload(path)
                .then(res => {
                    console.log('is then', res)
                    this.res = res;
                }).catch(err => {
                    console.error('is catch', err)
                    this.err = err;
                });
        }
    },

    components: {
        VPrint
    }
}
</script>

<style>
</style>