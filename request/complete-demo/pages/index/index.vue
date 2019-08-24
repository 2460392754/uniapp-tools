<template>
    <div></div>
</template>

<script>
import request from '../../xhr/index.xhr.js'

export default {
    methods: {
        // get请求 ,callback
        getMockDataMethodGet () {
            request.getMockDataMethodGet({
                success: res => {
                    console.log('👍👍👍👍👍 success callback')
                },
                fail: err => {
                    console.log('⛔⛔⛔⛔⛔ fail callback')
                },
                complete: res => {
                    console.log('😐😐😐😐😐 complete callback')
                }
            });
        },

        // post请求 ,callback
        getMockDataMethodPost () {
            request.getMockDataMethodPost()
        },

        // get请求，状态码 400 ,callback
        getMockErrDataMethodGet () {
            request.getMockErrDataMethodGet();
        },

        // get请求，Promise
        getMockDataMethodGetPromise () {
            request.getMockDataMethodGetPromise()
                .then(res => {
                    console.log('👍👍👍👍👍 then', res)
                })
                .catch(err => {
                    console.log('⛔⛔⛔⛔⛔ catch', err)
                })
                .finally(() => {
                    console.log('😐😐😐😐😐 finally')
                })
        }
    },

    created () {
        this.getMockDataMethodGet();
        // this.getMockDataMethodPost();
        // this.getMockErrDataMethodGet();
        // this.getMockDataMethodGetPromise();
    },
}
</script>