import request from '../plugins/request/js/index'

export default {
    // get请求 ,callback
    getMockDataMethodGet ({ success, fail, complete } = {}) {
        const instance = new request();

        // 局部请求拦截器
        instance.addInterceptors.request(config => {
            console.log('📑 request config: ', config)

            return config;
            // return false;
        })

        // 局部响应拦截器
        instance.addInterceptors.response(res => {
            console.log(`📧 response result`, res)

            // return res.data
            return res;
            // return false;
        })

        const r = instance.get({
            url: "/5cda87e31d38be0d2dd91a44/example/get",
            data: { text: 'method type is get' },
            // contentType: 'json',
            header: {
                // sid: 'xxx'
            },
            success: res => {
                console.log('👍 getMockDataGet success: ', res)

                success && success(res)
            },
            fail: err => {
                console.log(`⛔ getMockDataGet fail: `, err)

                fail && fail(err)
            },
            complete: res => {
                console.log(`😐 getMockDataGet complete: `, res)

                complete && complete(res)
            }
        });

        // 停止发生请求
        // instance.stop(r)
    },

    // post请求 ,callback
    getMockDataMethodPost () {
        const instance = new request();

        const r = instance.post({
            url: "/5cda87e31d38be0d2dd91a44/example/post",
            data: { text: 'method type is post' },
            success: res => {
                console.log('👍 getMockDataMethodPost success: ', res)
            },
            fail: err => {
                console.log(`⛔ getMockDataMethodPost fail: `, err)
            },
            complete: res => {
                console.log(`😐 getMockDataMethodPost complete: `, res)
            }
        })
    },

    // get请求，状态码 400 ,callback
    getMockErrDataMethodGet () {
        const instance = new request();
        const r = instance.get({
            url: "/5cda87e31d38be0d2dd91a44/example/get_400",
            data: { text: 'method type is get, state is 400' },
            contentType: 'form',
            success: res => {
                console.log('👍 getMockErrDataMethodGet success: ', res)
            },
            fail: err => {
                console.log(`⛔ getMockErrDataMethodGet fail: `, err)
            },
            complete: res => {
                console.log(`😐 getMockErrDataMethodGet complete: `, res)
            }
        });
    },

    // get请求，Promise
    getMockDataMethodGetPromise (canRunState = true) {
        const instance = new request();
        const r = instance.get({
            url: "/5cda87e31d38be0d2dd91a44/example/get",
            data: { text: 'method type is get' },
            contentType: 'form',
        });

        !canRunState && instance.stop(r)

        return r;
    },

    // put请求，Promise
    getMockDataMethodPut () {
        return new request().put({
            url: "/5cda87e31d38be0d2dd91a44/example/put",
            params: { aid: '2', uid: '5' },
            data: { text: 'method type is put' },
        })
    },

    mockUpload () {
        return new request().upload({
            url: "https://www.easy-mock.com/mock/5cda87e31d38be0d2dd91a44/example/upload",
            name: 'file',
            filePath: 'data:image/png;base64,xxxxxxxxxx',
            formData: { text: 'is mock upload file' },
        });
    },

    mockDownload () {
        return new request().download({
            url: 'https://dummyimage.com/120x60',
        })
    }
}