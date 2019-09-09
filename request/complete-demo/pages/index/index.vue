<template>
    <div></div>
</template>

<script>
import Api from '../../xhr/index.xhr.js'

export default {
    methods: {
        // get请求 ,callback
        getMockDataMethodGet () {
            Api.getMockDataMethodGet({
                success: res => {
                    // console.log('👍👍👍👍👍 success callback')
                },
                fail: err => {
                    // console.log('⛔⛔⛔⛔⛔ fail callback')
                },
                complete: res => {
                    // console.log('😐😐😐😐😐 complete callback')
                }
            });
        },

        // post请求 ,callback
        getMockDataMethodPost () {
            Api.getMockDataMethodPost()
        },

        // get请求，状态码 400 ,callback
        getMockErrDataMethodGet () {
            Api.getMockErrDataMethodGet();
        },

        // get请求，Promise
        getMockDataMethodGetPromise () {
            Api.getMockDataMethodGetPromise()
                .then(res => {
                    console.log('👍👍👍👍👍 then', res)
                })
                .catch(err => {
                    console.log('⛔⛔⛔⛔⛔ catch', err)
                })
                .finally(() => {
                    console.log('😐😐😐😐😐 finally')
                })
        },

        // put请求，Promise
        getMockDataMethodPut () {
            Api.getMockDataMethodPut()
                .then(res => {
                    console.log('👍👍👍👍👍 then', res)
                })
                .catch(err => {
                    console.log('⛔⛔⛔⛔⛔ catch', err)
                })
        },

        // 上传
        mockUpload () {
            Api.mockUpload()
                .then(res => {
                    console.log('👍👍👍👍👍 then', res)
                })
                .catch(err => {
                    console.log('⛔⛔⛔⛔⛔ catch', err)
                })
        },

        // 下载
        mockDownload () {
            Api.mockDownload()
                .then(res => {
                    console.log('👍👍👍👍👍 then', res)
                })
                .catch(err => {
                    console.log('⛔⛔⛔⛔⛔ catch', err)
                })
        }
    },

    created () {
        this.getMockDataMethodGet();
        // this.getMockDataMethodPost();
        // this.getMockErrDataMethodGet();
        // this.getMockDataMethodGetPromise();
        // this.getMockDataMethodPut();
        // this.mockUpload();
        // this.mockDownload();
    },
}
</script>